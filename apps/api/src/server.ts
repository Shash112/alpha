import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { validateEnv, SYSTEM_CONSTANTS } from '@alpha/config';
import { query, transaction, seedDatabase } from '@alpha/database';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  extractTenantContext
} from '@alpha/auth';
import { EntitlementEngine } from '@alpha/entitlements';
import { RazorpayAdapter } from '@alpha/billing';
import { AnalyticsCollector } from '@alpha/analytics';
import { NotificationDispatcher } from '@alpha/notifications';
import { IntegrationService } from '@alpha/integrations';
import { ApiErrorResponse, ErrorCode } from '@alpha/types';

export function createServer() {
  const app = express();
  const env = validateEnv();

  // 1. Middlewares
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request Correlation ID Middleware
  app.use((req: any, res: Response, next: NextFunction) => {
    req.requestId = `req_${crypto.randomBytes(6).toString('hex')}`;
    res.setHeader('X-Request-Id', req.requestId);
    next();
  });

  // JWT Auth Middleware
  app.use((req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        req.user = verifyAccessToken(token);
      } catch (err) {
        // Invalid token; leave req.user undefined
      }
    }
    next();
  });

  // Helper Error Function
  const sendError = (res: Response, status: number, code: ErrorCode, message: string, details?: any) => {
    const response: ApiErrorResponse = {
      code,
      message,
      requestId: (res.req as any).requestId || 'req_unknown',
      timestamp: new Date().toISOString(),
      details
    };
    return res.status(status).json(response);
  };

  // Centralized Audit Logger
  const recordAuditLog = async (params: {
    workspaceId: string;
    actorUserId: string;
    action: string;
    targetResourceType: string;
    targetResourceId: string;
    changes?: Record<string, any>;
    req: Request;
  }) => {
    try {
      await query(
        `INSERT INTO audit_logs (workspace_id, actor_user_id, action, target_resource_type, target_resource_id, changes_json, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          params.workspaceId,
          params.actorUserId,
          params.action,
          params.targetResourceType,
          params.targetResourceId,
          JSON.stringify(params.changes || {}),
          params.req.ip || '127.0.0.1',
          params.req.headers['user-agent'] || 'Unknown'
        ]
      );
    } catch (err) {
      console.error('Audit Log Insertion Failed:', err);
    }
  };

  // Auth Guard Helper
  const requireAuth = (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHENTICATED', 'Authentication access token is required or expired.');
    }
    next();
  };

  // Tenant Guard Helper
  const requireTenant = async (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHENTICATED', 'Authentication required.');
    }

    const tenantCtx = extractTenantContext(req);
    if (!tenantCtx) {
      return sendError(res, 403, 'TENANT_ACCESS_DENIED', 'Missing required X-Workspace-Id header or workspace route context.');
    }

    // Verify User holds an ACTIVE membership in target workspace
    const memRes = await query(
      `SELECT m.id, m.role_id, r.name as role_name
       FROM workspace_memberships m
       JOIN roles r ON m.role_id = r.id
       WHERE m.workspace_id = $1 AND m.user_id = $2 AND m.status = 'ACTIVE'`,
      [tenantCtx.workspaceId, tenantCtx.userId]
    );

    if (memRes.rowCount === 0 && !req.user.isSuperAdmin) {
      return sendError(res, 403, 'TENANT_ACCESS_DENIED', 'You do not possess an active membership in the target workspace.');
    }

    req.tenantContext = {
      ...tenantCtx,
      roleId: memRes.rows[0]?.role_id,
      roleName: memRes.rows[0]?.role_name
    };

    next();
  };

  // ==========================================
  // HEALTH CHECK ENDPOINTS
  // ==========================================
  app.get('/health/live', (req: Request, res: Response) => {
    res.status(200).json({ status: 'live', timestamp: new Date().toISOString() });
  });

  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/health/ready', async (req: Request, res: Response) => {
    try {
      await query('SELECT 1');
      res.status(200).json({ status: 'ready', database: 'connected', redis: 'connected' });
    } catch (err) {
      res.status(503).json({ status: 'degraded', database: 'disconnected', error: String(err) });
    }
  });

  // ==========================================
  // 1. AUTH DOMAIN (/api/v1/auth)
  // ==========================================
  app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, displayName } = req.body;
      if (!email || !password || !displayName) {
        return sendError(res, 400, 'INVALID_INPUT', 'Email, password, and displayName are required.');
      }

      const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      if (existing.rowCount && existing.rowCount > 0) {
        return sendError(res, 409, 'INVALID_INPUT', 'An account with this email address already exists.');
      }

      const pwdHash = await hashPassword(password);

      const result = await transaction(async (client) => {
        const userId = crypto.randomUUID();
        const workspaceId = crypto.randomUUID();
        const ownerRoleId = crypto.randomUUID();
        const membershipId = crypto.randomUUID();
        const subId = crypto.randomUUID();

        const userRes = await client.query(
          `INSERT INTO users (id, email, password_hash, first_name, last_name, display_name, email_verified)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)
           RETURNING id, email, display_name`,
          [userId, email.toLowerCase().trim(), pwdHash, firstName || null, lastName || null, displayName]
        );
        const user = userRes.rows[0];

        const wsRes = await client.query(
          `INSERT INTO workspaces (id, type, name, owner_user_id, status)
           VALUES ($1, 'PERSONAL', $2, $3, 'ACTIVE')
           RETURNING id`,
          [workspaceId, `${displayName}'s Workspace`, user.id]
        );

        const roleRes = await client.query(
          `INSERT INTO roles (id, workspace_id, name, is_system) VALUES ($1, $2, 'Owner', TRUE) RETURNING id`,
          [ownerRoleId, workspaceId]
        );

        await client.query(
          `INSERT INTO workspace_memberships (id, workspace_id, user_id, role_id, status)
           VALUES ($1, $2, $3, $4, 'ACTIVE')`,
          [membershipId, workspaceId, user.id, ownerRoleId]
        );

        await client.query(
          `INSERT INTO subscriptions (id, workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
           VALUES ($1, $2, 'plan_free_personal', 'INTERNAL', $3, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [subId, workspaceId, `free_sub_${user.id}`]
        );

        return { user, workspaceId };
      });

      const accessToken = generateAccessToken({
        sub: result.user.id,
        email: result.user.email,
        defaultWorkspaceId: result.workspaceId
      });
      const refreshToken = generateRefreshToken({ sub: result.user.id, tokenVersion: 1 });

      const tokens = { accessToken, refreshToken };

      await NotificationDispatcher.sendVerificationEmail(result.user.email, 'mock_verification_token');

      return res.status(201).json({
        user: result.user,
        defaultWorkspaceId: result.workspaceId,
        workspace: { id: result.workspaceId },
        accessToken,
        refreshToken,
        tokens
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 400, 'INVALID_INPUT', 'Email and password are required.');
      }

      const userRes = await query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email.toLowerCase().trim()]);
      if (userRes.rowCount === 0) {
        return sendError(res, 401, 'UNAUTHENTICATED', 'Invalid email or password.');
      }

      const user = userRes.rows[0];
      const valid = await comparePassword(password, user.password_hash || '');
      if (!valid) {
        return sendError(res, 401, 'UNAUTHENTICATED', 'Invalid email or password.');
      }

      const wsRes = await query(
        `SELECT workspace_id FROM workspace_memberships WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1`,
        [user.id]
      );
      const defaultWorkspaceId = wsRes.rows[0]?.workspace_id;

      const accessToken = generateAccessToken({ sub: user.id, email: user.email, defaultWorkspaceId });
      const refreshToken = generateRefreshToken({ sub: user.id, tokenVersion: 1 });
      const tokens = { accessToken, refreshToken };

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          avatarUrl: user.avatar_url,
          status: user.status
        },
        defaultWorkspaceId,
        workspace: { id: defaultWorkspaceId },
        accessToken,
        refreshToken,
        tokens
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/auth/me', requireAuth, async (req: any, res: Response) => {
    try {
      const userRes = await query('SELECT id, email, display_name, first_name, last_name, avatar_url, phone, locale, timezone, status FROM users WHERE id = $1', [req.user.sub]);
      if (userRes.rowCount === 0) {
        return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'User profile not found.');
      }

      const memRes = await query(
        `SELECT m.workspace_id, w.name as workspace_name, w.type as workspace_type, r.name as role_name
         FROM workspace_memberships m
         JOIN workspaces w ON m.workspace_id = w.id
         JOIN roles r ON m.role_id = r.id
         WHERE m.user_id = $1 AND m.status = 'ACTIVE'`,
        [req.user.sub]
      );

      return res.status(200).json({
        user: userRes.rows[0],
        workspaces: memRes.rows
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // Password Reset Request
  app.post('/api/v1/auth/password/reset-request', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) return sendError(res, 400, 'INVALID_INPUT', 'Email is required.');

      const resetToken = `rst_${crypto.randomBytes(16).toString('hex')}`;
      await NotificationDispatcher.sendPasswordResetEmail(email, resetToken);

      return res.status(200).json({ status: 'SUCCESS', message: 'If an account exists, a password reset email has been dispatched.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // Password Reset Confirm
  app.post('/api/v1/auth/password/reset-confirm', async (req: Request, res: Response) => {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) return sendError(res, 400, 'INVALID_INPUT', 'Reset token and new password are required.');

      return res.status(200).json({ status: 'SUCCESS', message: 'Password has been successfully reset. Please sign in.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // Update Profile
  app.patch('/api/v1/users/me', requireAuth, async (req: any, res: Response) => {
    try {
      const { displayName, firstName, lastName, phone } = req.body;
      await query(
        `UPDATE users SET display_name = COALESCE($1, display_name), first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), phone = COALESCE($4, phone), updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
        [displayName, firstName, lastName, phone, req.user.sub]
      );
      return res.status(200).json({ status: 'SUCCESS', message: 'Profile updated successfully.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 2. WORKSPACES DOMAIN (/api/v1/workspaces)
  // ==========================================
  app.get('/api/v1/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const resData = await query(
        `SELECT w.id, w.type, w.name, w.owner_user_id, w.status, w.logo_url, w.brand_color, w.created_at, r.name as role_name
         FROM workspace_memberships m
         JOIN workspaces w ON m.workspace_id = w.id
         JOIN roles r ON m.role_id = r.id
         WHERE m.user_id = $1 AND m.status = 'ACTIVE'`,
        [req.user.sub]
      );
      return res.status(200).json({ data: resData.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const { name, type } = req.body;
      if (!name) return sendError(res, 400, 'INVALID_INPUT', 'Workspace name is required.');

      const result = await transaction(async (client) => {
        const wsRes = await client.query(
          `INSERT INTO workspaces (type, name, owner_user_id, status)
           VALUES ($1, $2, $3, 'ACTIVE')
           RETURNING *`,
          [type || 'TEAM', name, req.user.sub]
        );
        const workspace = wsRes.rows[0];

        const roleRes = await client.query(
          `INSERT INTO roles (workspace_id, name, is_system) VALUES ($1, 'Owner', TRUE) RETURNING id`,
          [workspace.id]
        );
        const ownerRoleId = roleRes.rows[0].id;

        await client.query(
          `INSERT INTO workspace_memberships (workspace_id, user_id, role_id, status)
           VALUES ($1, $2, $3, 'ACTIVE')`,
          [workspace.id, req.user.sub, ownerRoleId]
        );

        await client.query(
          `INSERT INTO subscriptions (workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
           VALUES ($1, 'plan_free_personal', 'INTERNAL', $2, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '10 years')`,
          [workspace.id, `free_sub_${workspace.id}`]
        );

        return workspace;
      });

      await recordAuditLog({
        workspaceId: result.id,
        actorUserId: req.user.sub,
        action: 'workspace.created',
        targetResourceType: 'Workspace',
        targetResourceId: result.id,
        req
      });

      return res.status(201).json(result);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 3. CARDS DOMAIN (/api/v1/workspaces/:workspaceId/cards)
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/cards', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const cardsRes = await query(
        `SELECT c.id, c.public_id, c.workspace_id, c.title, c.status, c.theme_color, c.theme_name, c.published_revision_id, c.created_at, c.updated_at,
                a.path as vanity_slug,
                cr.content_data as raw_sections
         FROM cards c
         LEFT JOIN aliases a ON c.id = a.card_id AND a.is_active = TRUE
         LEFT JOIN card_revisions cr ON (c.published_revision_id = cr.id OR cr.card_id = c.id)
         WHERE c.workspace_id = $1 AND c.deleted_at IS NULL
         ORDER BY c.created_at DESC`,
        [req.tenantContext.workspaceId]
      );

      const data = cardsRes.rows.map(card => {
        const sectionsObj: Record<string, any> = {};
        if (card.raw_sections) {
          if (Array.isArray(card.raw_sections)) {
            card.raw_sections.forEach((sec: any) => {
              if (sec.fields) {
                Object.entries(sec.fields).forEach(([k, v]: [string, any]) => {
                  sectionsObj[k] = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
                });
              }
            });
          } else if (typeof card.raw_sections === 'object') {
            Object.assign(sectionsObj, card.raw_sections);
          }
        }
        return {
          id: card.id,
          public_id: card.public_id,
          workspace_id: card.workspace_id,
          title: card.title,
          status: card.status,
          theme_color: card.theme_color || '#2563EB',
          theme_name: card.theme_name || 'Professional',
          vanity_slug: card.vanity_slug || '',
          created_at: card.created_at,
          updated_at: card.updated_at,
          sections: sectionsObj
        };
      });

      return res.status(200).json({ data });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/cards', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { title, templateSlug, template, vanityAlias } = req.body;
      if (!title) return sendError(res, 400, 'INVALID_INPUT', 'Card title is required.');

      const activeCardCountRes = await query(
        `SELECT COUNT(*)::int as count FROM cards WHERE workspace_id = $1 AND deleted_at IS NULL`,
        [req.tenantContext.workspaceId]
      );
      const currentCount = activeCardCountRes.rows[0].count;
      const limitCheck = await EntitlementEngine.checkUsageLimit(req.tenantContext.workspaceId, 'cards.max_active_count', currentCount);
      
      if (!limitCheck.isAllowed) {
        return sendError(
          res, 403, 'ENTITLEMENT_LIMIT_EXCEEDED',
          `You have reached the maximum active card limit (${limitCheck.limit}) for your current plan.`
        );
      }

      const slugToFind = templateSlug || template || 'corporate-executive';
      let tmplRes = await query(`SELECT id FROM templates WHERE slug = $1 LIMIT 1`, [slugToFind]);
      if (tmplRes.rowCount === 0) {
        tmplRes = await query(`SELECT id FROM templates ORDER BY created_at ASC LIMIT 1`);
      }
      const templateId = tmplRes.rows[0]?.id;
      if (!templateId) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Template not found.');

      const publicId = `c_${crypto.randomBytes(8).toString('hex')}`;

      const cardResult = await transaction(async (client) => {
        const newCardId = crypto.randomUUID();
        const newRevId = crypto.randomUUID();
        const newAliasId = crypto.randomUUID();

        const cRes = await client.query(
          `INSERT INTO cards (id, public_id, workspace_id, owner_user_id, template_id, title, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'DRAFT')
           RETURNING *`,
          [newCardId, publicId, req.tenantContext.workspaceId, req.tenantContext.userId, templateId, title]
        );
        const card = cRes.rows[0];

        const defaultSections = [
          {
            id: 'sec_hero',
            type: 'hero',
            order: 0,
            enabled: true,
            fields: {
              name: { value: title, visibility: 'PUBLIC' },
              designation: { value: 'Professional Identity', visibility: 'PUBLIC' }
            }
          },
          {
            id: 'sec_contact',
            type: 'contact',
            order: 1,
            enabled: true,
            fields: {
              email: { value: req.user.email, visibility: 'PUBLIC' },
              phone: { value: '+919876543210', visibility: 'PUBLIC' }
            }
          }
        ];

        const revRes = await client.query(
          `INSERT INTO card_revisions (id, card_id, revision_number, content_data, visibility_data, created_by)
           VALUES ($1, $2, 1, $3, '{}', $4)
           RETURNING id`,
          [newRevId, card.id, JSON.stringify(defaultSections), req.tenantContext.userId]
        );

        await client.query(`UPDATE cards SET published_revision_id = $1 WHERE id = $2`, [revRes.rows[0].id, card.id]);

        if (vanityAlias) {
          const normalizedAlias = vanityAlias.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
          if (SYSTEM_CONSTANTS.RESERVED_SLUGS.includes(normalizedAlias)) {
            throw new Error(`SLUG_RESERVED:${normalizedAlias}`);
          }
          await client.query(
            `INSERT INTO aliases (id, card_id, hostname, path, is_active) VALUES ($1, $2, 'alpha.com', $3, TRUE)`,
            [newAliasId, card.id, normalizedAlias]
          );
        }

        return card;
      });

      await recordAuditLog({
        workspaceId: req.tenantContext.workspaceId,
        actorUserId: req.tenantContext.userId,
        action: 'cards.create',
        targetResourceType: 'Card',
        targetResourceId: cardResult.id,
        req
      });

      return res.status(201).json({
        ...cardResult,
        canonicalUrl: `${SYSTEM_CONSTANTS.CANONICAL_DOMAIN}${SYSTEM_CONSTANTS.CANONICAL_CARD_PREFIX}${cardResult.public_id}`
      });
    } catch (err: any) {
      if (err.message?.startsWith('SLUG_RESERVED:')) {
        return sendError(res, 400, 'SLUG_RESERVED', 'The requested vanity URL path is reserved.');
      }
      if (err.code === '23505') {
        return sendError(res, 409, 'CARD_SLUG_ALREADY_EXISTS', 'The requested vanity URL is already claimed.');
      }
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.put('/api/v1/workspaces/:workspaceId/cards/:cardId', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { cardId } = req.params;
      const { title, vanitySlug, themeColor, themeName, status, sections } = req.body;

      const cRes = await query('SELECT id FROM cards WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL', [cardId, req.tenantContext.workspaceId]);
      if (cRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card not found.');

      await transaction(async (client) => {
        const newStatus = status === 'PUBLISHED' ? 'PUBLISHED' : undefined;
        await client.query(
          `UPDATE cards 
           SET title = COALESCE($1, title), 
               theme_color = COALESCE($2, theme_color), 
               theme_name = COALESCE($3, theme_name),
               status = COALESCE($4, status),
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $5`,
          [title, themeColor, themeName, newStatus, cardId]
        );

        if (sections) {
          const updateRevId = crypto.randomUUID();
          const formattedContentData = [
            {
              id: 'sec_hero',
              type: 'hero',
              order: 0,
              enabled: true,
              fields: {
                name: { value: title || 'Professional Identity', visibility: 'PUBLIC' },
                designation: { value: sections.designation || '', visibility: 'PUBLIC' },
                company: { value: sections.company || '', visibility: 'PUBLIC' },
                bio: { value: sections.bio || '', visibility: 'PUBLIC' }
              }
            },
            {
              id: 'sec_contact',
              type: 'contact',
              order: 1,
              enabled: true,
              fields: {
                email: { value: sections.email || '', visibility: 'PUBLIC' },
                phone: { value: sections.phone || '', visibility: 'PUBLIC' },
                website: { value: sections.website || '', visibility: 'PUBLIC' },
                social_linkedin: { value: sections.social_linkedin || '', visibility: 'PUBLIC' },
                social_twitter: { value: sections.social_twitter || '', visibility: 'PUBLIC' },
                social_instagram: { value: sections.social_instagram || '', visibility: 'PUBLIC' },
                social_github: { value: sections.social_github || '', visibility: 'PUBLIC' },
                social_youtube: { value: sections.social_youtube || '', visibility: 'PUBLIC' },
                social_whatsapp: { value: sections.social_whatsapp || '', visibility: 'PUBLIC' }
              }
            }
          ];

          const revRes = await client.query(
            `INSERT INTO card_revisions (id, card_id, revision_number, content_data, visibility_data, created_by)
             VALUES ($1, $2, (SELECT COALESCE(MAX(revision_number), 0) + 1 FROM card_revisions WHERE card_id = $2), $3, '{}', $4)
             RETURNING id`,
            [updateRevId, cardId, JSON.stringify(formattedContentData), req.tenantContext.userId]
          );

          await client.query(`UPDATE cards SET published_revision_id = $1 WHERE id = $2`, [revRes.rows[0].id, cardId]);
        }

        if (vanitySlug) {
          const updateAliasId = crypto.randomUUID();
          const normalized = vanitySlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
          if (normalized) {
            await client.query(`UPDATE aliases SET is_active = FALSE WHERE card_id = $1`, [cardId]);
            await client.query(
              `INSERT INTO aliases (id, card_id, hostname, path, is_active)
               VALUES ($1, $2, 'alpha.com', $3, TRUE)
               ON CONFLICT (hostname, path) DO UPDATE SET card_id = $2, is_active = TRUE`,
              [updateAliasId, cardId, normalized]
            );
          }
        }
      });

      return res.status(200).json({ status: 'SUCCESS', message: 'Card profile updated and saved.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/cards/:cardId/publish', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { cardId } = req.params;
      const cRes = await query('SELECT id FROM cards WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL', [cardId, req.tenantContext.workspaceId]);
      if (cRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card not found.');

      await query(`UPDATE cards SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cardId]);

      await recordAuditLog({
        workspaceId: req.tenantContext.workspaceId,
        actorUserId: req.tenantContext.userId,
        action: 'cards.publish',
        targetResourceType: 'Card',
        targetResourceId: cardId,
        req
      });

      return res.status(200).json({ status: 'PUBLISHED', message: 'Card successfully published.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.delete('/api/v1/workspaces/:workspaceId/cards/:cardId', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { cardId } = req.params;
      await query(`UPDATE cards SET deleted_at = CURRENT_TIMESTAMP, status = 'DELETED' WHERE id = $1 AND workspace_id = $2`, [cardId, req.tenantContext.workspaceId]);
      return res.status(200).json({ status: 'DELETED', message: 'Card archived.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 4. DEPARTMENTS & TEAMS DOMAINS
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/departments', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const deptRes = await query('SELECT * FROM departments WHERE workspace_id = $1 ORDER BY name ASC', [req.tenantContext.workspaceId]);
      return res.status(200).json({ data: deptRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/departments', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { name, code } = req.body;
      if (!name) return sendError(res, 400, 'INVALID_INPUT', 'Department name is required.');

      const deptRes = await query(
        `INSERT INTO departments (workspace_id, name, code) VALUES ($1, $2, $3) RETURNING *`,
        [req.tenantContext.workspaceId, name, code]
      );
      return res.status(201).json(deptRes.rows[0]);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/workspaces/:workspaceId/teams', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const teamsRes = await query('SELECT * FROM teams WHERE workspace_id = $1 ORDER BY name ASC', [req.tenantContext.workspaceId]);
      return res.status(200).json({ data: teamsRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/teams', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { name, departmentId } = req.body;
      if (!name) return sendError(res, 400, 'INVALID_INPUT', 'Team name is required.');

      const teamRes = await query(
        `INSERT INTO teams (workspace_id, department_id, name) VALUES ($1, $2, $3) RETURNING *`,
        [req.tenantContext.workspaceId, departmentId || null, name]
      );
      return res.status(201).json(teamRes.rows[0]);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 5. NFC SUBSYSTEM DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/nfc', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const nfcRes = await query('SELECT * FROM nfc_devices WHERE workspace_id = $1', [req.tenantContext.workspaceId]);
      return res.status(200).json({ data: nfcRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/nfc/claim', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { deviceUid, activationCode, assignedCardId } = req.body;
      if (!deviceUid || !activationCode) return sendError(res, 400, 'INVALID_INPUT', 'Device UID and Activation Code are required.');

      const nfcRes = await query(
        `INSERT INTO nfc_devices (device_uid, activation_code, workspace_id, assigned_card_id, status)
         VALUES ($1, $2, $3, $4, 'ACTIVE')
         ON CONFLICT (device_uid) DO UPDATE SET workspace_id = $3, assigned_card_id = $4, status = 'ACTIVE'
         RETURNING *`,
        [deviceUid, activationCode, req.tenantContext.workspaceId, assignedCardId || null]
      );

      return res.status(200).json({ status: 'CLAIMED', device: nfcRes.rows[0] });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // PUBLIC NFC TAP REDIRECTION (HTTP 302 to Canonical Card)
  app.get('/nfc/:deviceUid', async (req: Request, res: Response) => {
    try {
      const { deviceUid } = req.params;
      const nfcRes = await query(
        `SELECT n.status, c.public_id
         FROM nfc_devices n
         JOIN cards c ON n.assigned_card_id = c.id
         WHERE n.device_uid = $1`,
        [deviceUid]
      );

      if (nfcRes.rowCount === 0 || nfcRes.rows[0].status !== 'ACTIVE') {
        return res.status(404).send('NFC Card is unactivated or unassigned.');
      }

      // Increment tap count asynchronously
      query(`UPDATE nfc_devices SET tap_count = tap_count + 1, last_tapped_at = CURRENT_TIMESTAMP WHERE device_uid = $1`, [deviceUid]);

      return res.redirect(302, `/api/v1/public/cards/id/${nfcRes.rows[0].public_id}`);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 6. APPOINTMENTS DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/appointments', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const apptRes = await query('SELECT * FROM appointments WHERE workspace_id = $1 ORDER BY start_time DESC', [req.tenantContext.workspaceId]);
      return res.status(200).json({ data: apptRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/public/cards/:publicId/slots', async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      // Prospective slots for booking demo
      const slots = [
        { startTime: '2026-09-20T10:00:00Z', endTime: '2026-09-20T10:30:00Z' },
        { startTime: '2026-09-20T11:00:00Z', endTime: '2026-09-20T11:30:00Z' },
        { startTime: '2026-09-20T14:00:00Z', endTime: '2026-09-20T14:30:00Z' }
      ];
      return res.status(200).json({ data: slots });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 7. CUSTOM DOMAINS DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/domains', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const domRes = await query('SELECT * FROM custom_domains WHERE workspace_id = $1', [req.tenantContext.workspaceId]);
      return res.status(200).json({ data: domRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/domains', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { hostname } = req.body;
      if (!hostname) return sendError(res, 400, 'INVALID_INPUT', 'Hostname is required.');

      const token = `txt_${crypto.randomBytes(16).toString('hex')}`;
      const domRes = await query(
        `INSERT INTO custom_domains (workspace_id, hostname, verification_token, status)
         VALUES ($1, $2, $3, 'PENDING_VERIFICATION')
         RETURNING *`,
        [req.tenantContext.workspaceId, hostname.toLowerCase().trim(), token]
      );
      return res.status(201).json(domRes.rows[0]);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 8. RESELLER PLATFORM DOMAIN
  // ==========================================
  app.get('/api/v1/reseller/clients', requireAuth, async (req: any, res: Response) => {
    try {
      const clientsRes = await query(
        `SELECT rc.id, rc.client_workspace_id, w.name as client_name, rc.commission_status, rc.created_at
         FROM reseller_clients rc
         JOIN workspaces w ON rc.client_workspace_id = w.id
         WHERE rc.reseller_workspace_id = $1`,
        [req.headers['x-workspace-id']]
      );
      return res.status(200).json({ data: clientsRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // 9. AUDIT LOGS DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/audit-logs', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const auditRes = await query(
        `SELECT a.id, a.action, a.target_resource_type, a.target_resource_id, a.ip_address, a.created_at, u.display_name as actor_name
         FROM audit_logs a
         JOIN users u ON a.actor_user_id = u.id
         WHERE a.workspace_id = $1
         ORDER BY a.created_at DESC LIMIT 50`,
        [req.tenantContext.workspaceId]
      );
      return res.status(200).json({ data: auditRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // PUBLIC CARDS DOMAIN (/api/v1/public)
  // ==========================================
  app.get('/api/v1/public/cards/id/:publicId', async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const cardRes = await query(
        `SELECT c.id, c.public_id, c.workspace_id, c.title, c.status, c.published_revision_id, c.theme_color, c.theme_name,
                t.layout_schema, w.logo_url, w.brand_color
         FROM cards c
         JOIN templates t ON c.template_id = t.id
         JOIN workspaces w ON c.workspace_id = w.id
         WHERE c.public_id = $1 AND c.deleted_at IS NULL`,
        [publicId]
      );

      if (cardRes.rowCount === 0) {
        return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card profile not found.');
      }

      const card = cardRes.rows[0];

      if (card.status === 'SUSPENDED') {
        return res.status(451).json({
          code: 'CARD_SUSPENDED',
          message: 'This profile has been temporarily suspended due to safety or policy reviews.'
        });
      }

      if (card.status !== 'PUBLISHED') {
        return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'This card profile is currently offline or unpublished.');
      }

      let revRes = await query(`SELECT content_data FROM card_revisions WHERE id = $1`, [card.published_revision_id]);
      if (revRes.rowCount === 0) {
        revRes = await query(`SELECT content_data FROM card_revisions WHERE card_id = $1 ORDER BY revision_number DESC LIMIT 1`, [card.id]);
      }
      const rawSections = revRes.rows[0]?.content_data || [];

      const sanitizedSections = rawSections.map((sec: any) => {
        const cleanFields: Record<string, any> = {};
        for (const [key, field] of Object.entries<any>(sec.fields || {})) {
          if (field.visibility === 'PUBLIC') {
            cleanFields[key] = field.value;
          }
        }
        return {
          id: sec.id,
          type: sec.type,
          order: sec.order,
          fields: cleanFields
        };
      });

      AnalyticsCollector.recordEvent({
        workspaceId: card.workspace_id,
        cardId: card.id,
        eventType: 'VIEW',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }).catch(err => console.error('Analytics record error:', err));

      return res.status(200).json({
        publicId: card.public_id,
        title: card.title,
        themeColor: card.theme_color || '#2563EB',
        themeName: card.theme_name || 'Professional',
        canonicalUrl: `https://${SYSTEM_CONSTANTS.CANONICAL_DOMAIN}${SYSTEM_CONSTANTS.CANONICAL_CARD_PREFIX}${card.public_id}`,
        templateLayout: card.layout_schema,
        sections: sanitizedSections,
        workspaceBranding: {
          logoUrl: card.logo_url,
          brandColor: card.brand_color
        }
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/public/cards/alias/:alias', async (req: Request, res: Response) => {
    try {
      const aliasPath = req.params.alias.toLowerCase().trim();
      const aliasRes = await query(
        `SELECT c.public_id FROM aliases a JOIN cards c ON a.card_id = c.id WHERE a.path = $1 AND a.is_active = TRUE`,
        [aliasPath]
      );
      if (aliasRes.rowCount === 0) {
        return sendError(res, 404, 'RESOURCE_NOT_FOUND', `Vanity alias '${aliasPath}' not found.`);
      }
      return res.redirect(302, `/api/v1/public/cards/id/${aliasRes.rows[0].public_id}`);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/contact/submit', async (req: Request, res: Response) => {
    try {
      const { fullName, email, subject, message } = req.body;
      if (!fullName || !email || !message) {
        return sendError(res, 400, 'INVALID_INPUT', 'Full Name, Email, and Message are required.');
      }
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Your inquiry has been received. Our team will contact you shortly.'
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/public/cards/:publicId/vcard', async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const cRes = await query('SELECT title, public_id FROM cards WHERE public_id = $1', [publicId]);
      if (cRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card not found.');

      const vcardText = IntegrationService.generateVCard({
        displayName: cRes.rows[0].title,
        canonicalUrl: `https://${SYSTEM_CONSTANTS.CANONICAL_DOMAIN}${SYSTEM_CONSTANTS.CANONICAL_CARD_PREFIX}${publicId}`
      });

      res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${publicId}.vcf"`);
      return res.status(200).send(vcardText);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/public/cards/:publicId/leads', async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const { name, email, phone, company, notes } = req.body;

      if (!name) return sendError(res, 400, 'INVALID_INPUT', 'Name is required to submit a lead.');

      const cRes = await query('SELECT id, workspace_id, owner_user_id FROM cards WHERE public_id = $1 AND status = \'PUBLISHED\'', [publicId]);
      if (cRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card profile not found.');

      const card = cRes.rows[0];

      const leadRes = await query(
        `INSERT INTO leads (workspace_id, card_id, name, email, phone, company, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'NEW')
         RETURNING id`,
        [card.workspace_id, card.id, name, email, phone, company, notes]
      );

      AnalyticsCollector.recordEvent({
        workspaceId: card.workspace_id,
        cardId: card.id,
        eventType: 'LEAD_SUBMIT',
        ipAddress: req.ip
      }).catch(err => console.error('Lead analytics error:', err));

      return res.status(201).json({ status: 'SUCCESS', leadId: leadRes.rows[0].id, message: 'Thank you! Your contact details have been received.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // LEADS & CRM DOMAIN (/api/v1/workspaces/:workspaceId/leads)
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/leads', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const leadsRes = await query(
        `SELECT l.id, l.card_id, l.name, l.email, l.phone, l.company, l.notes, l.status, l.created_at, c.title as card_title
         FROM leads l
         JOIN cards c ON l.card_id = c.id
         WHERE l.workspace_id = $1
         ORDER BY l.created_at DESC`,
        [req.tenantContext.workspaceId]
      );
      return res.status(200).json({ data: leadsRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.get('/api/v1/workspaces/:workspaceId/leads/export', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const leadsRes = await query('SELECT name, email, phone, company, status, created_at FROM leads WHERE workspace_id = $1 ORDER BY created_at DESC', [req.tenantContext.workspaceId]);
      const csv = IntegrationService.generateLeadsCsv(leadsRes.rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads_${req.tenantContext.workspaceId}.csv"`);
      return res.status(200).send(csv);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // ANALYTICS DOMAIN (/api/v1/workspaces/:workspaceId/analytics)
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/analytics/overview', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const cardId = req.query.cardId as string;
      if (!cardId) return sendError(res, 400, 'INVALID_INPUT', 'Target cardId query parameter is required.');

      const metrics = await AnalyticsCollector.getAggregateMetrics(cardId, 30);
      return res.status(200).json({ data: metrics });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // BILLING DOMAIN (/api/v1/workspaces/:workspaceId/billing)
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/billing/plans', async (req: Request, res: Response) => {
    try {
      const plansRes = await query('SELECT id, family, name, billing_period, price_inr, entitlements_schema FROM plans WHERE is_active = TRUE ORDER BY price_inr ASC');
      return res.status(200).json({ data: plansRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/billing/checkout', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { planId } = req.body;
      const rzp = new RazorpayAdapter();
      const subResult = await rzp.createSubscription({
        workspaceId: req.tenantContext.workspaceId,
        planId,
        customerEmail: req.user.email,
        customerName: req.user.email
      });

      await query(
        `INSERT INTO subscriptions (workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
         VALUES ($1, $2, 'RAZORPAY', $3, 'ACTIVE', $4, $5)
         ON CONFLICT (workspace_id)
         DO UPDATE SET plan_id = $2, provider_subscription_id = $3, status = 'ACTIVE', current_period_start = $4, current_period_end = $5`,
        [req.tenantContext.workspaceId, planId, subResult.providerSubscriptionId, subResult.currentPeriodStart, subResult.currentPeriodEnd]
      );

      await recordAuditLog({
        workspaceId: req.tenantContext.workspaceId,
        actorUserId: req.tenantContext.userId,
        action: 'billing.checkout',
        targetResourceType: 'Subscription',
        targetResourceId: subResult.providerSubscriptionId,
        req
      });

      return res.status(200).json(subResult);
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // CARD BUILDER PERSISTENCE DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/cards/:cardId', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { cardId } = req.params;
      const cardRes = await query(
        `SELECT c.id, c.public_id, c.title, c.status, c.template_id, c.created_at, a.path as vanity_alias,
                w.brand_color, cr.content_data, cr.visibility_data
         FROM cards c
         LEFT JOIN aliases a ON c.id = a.card_id AND a.is_active = TRUE
         LEFT JOIN workspaces w ON c.workspace_id = w.id
         LEFT JOIN card_revisions cr ON c.id = cr.card_id
         WHERE c.id = $1 AND c.workspace_id = $2
         ORDER BY cr.revision_number DESC LIMIT 1`,
        [cardId, req.tenantContext.workspaceId]
      );
      if (cardRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', 'Card profile not found.');
      return res.status(200).json({ data: cardRes.rows[0] });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.put('/api/v1/workspaces/:workspaceId/cards/:cardId', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { cardId } = req.params;
      const { title, vanityAlias, brandColor, sections, visibilityRules } = req.body;

      await transaction(async (client) => {
        if (title) {
          await client.query('UPDATE cards SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND workspace_id = $3', [title, cardId, req.tenantContext.workspaceId]);
        }
        if (brandColor) {
          await client.query('UPDATE workspaces SET brand_color = $1 WHERE id = $2', [brandColor, req.tenantContext.workspaceId]);
        }
        if (vanityAlias) {
          await client.query('UPDATE aliases SET is_active = FALSE WHERE card_id = $1', [cardId]);
          await client.query(
            `INSERT INTO aliases (card_id, hostname, path, is_active)
             VALUES ($1, 'alpha.com', $2, TRUE)
             ON CONFLICT (hostname, path) DO UPDATE SET card_id = $1, is_active = TRUE`,
            [cardId, vanityAlias.toLowerCase().trim()]
          );
        }

        const revRes = await client.query('SELECT COALESCE(MAX(revision_number), 0) as max_rev FROM card_revisions WHERE card_id = $1', [cardId]);
        const nextRev = (parseInt(revRes.rows[0]?.max_rev, 10) || 0) + 1;

        await client.query(
          `INSERT INTO card_revisions (card_id, revision_number, content_data, visibility_data, created_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [cardId, nextRev, JSON.stringify(sections || []), JSON.stringify(visibilityRules || {}), req.user.id]
        );
      });

      return res.status(200).json({ status: 'SUCCESS', message: 'Card updated and saved to database successfully.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // WORKSPACE SETTINGS & MEMBERS DOMAIN
  // ==========================================
  app.get('/api/v1/workspaces/:workspaceId/members', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const membersRes = await query(
        `SELECT wm.id, wm.user_id, u.display_name as name, u.email, r.name as role, wm.status, wm.joined_at
         FROM workspace_memberships wm
         JOIN users u ON wm.user_id = u.id
         JOIN roles r ON wm.role_id = r.id
         WHERE wm.workspace_id = $1
         ORDER BY wm.joined_at ASC`,
        [req.tenantContext.workspaceId]
      );
      return res.status(200).json({ data: membersRes.rows });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/workspaces/:workspaceId/members/invite', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { email, role } = req.body;
      if (!email) return sendError(res, 400, 'INVALID_INPUT', 'Email address is required for invitation.');

      let userRes = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      let userId: string;

      if (userRes.rowCount === 0) {
        const newUser = await query(
          `INSERT INTO users (email, display_name, status)
           VALUES ($1, $2, 'INVITED') RETURNING id`,
          [email.toLowerCase().trim(), email.split('@')[0]]
        );
        userId = newUser.rows[0].id;
      } else {
        userId = userRes.rows[0].id;
      }

      const roleRes = await query(
        'SELECT id FROM roles WHERE (workspace_id = $1 OR is_system = TRUE) AND name = $2 LIMIT 1',
        [req.tenantContext.workspaceId, role || 'MEMBER']
      );
      const roleId = roleRes.rows[0]?.id;

      await query(
        `INSERT INTO workspace_memberships (workspace_id, user_id, role_id, status, invited_by)
         VALUES ($1, $2, $3, 'INVITED', $4)
         ON CONFLICT (workspace_id, user_id) DO UPDATE SET status = 'INVITED', role_id = $3`,
        [req.tenantContext.workspaceId, userId, roleId, req.user.id]
      );

      return res.status(201).json({ status: 'SUCCESS', message: `Invitation sent to ${email}` });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.put('/api/v1/workspaces/:workspaceId/settings', requireAuth, requireTenant, async (req: any, res: Response) => {
    try {
      const { name, customDomain } = req.body;
      if (name) {
        await query('UPDATE workspaces SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [name, req.tenantContext.workspaceId]);
      }
      if (customDomain) {
        const token = `verify_${crypto.randomBytes(8).toString('hex')}`;
        await query(
          `INSERT INTO custom_domains (workspace_id, hostname, verification_token, status, ssl_status)
           VALUES ($1, $2, $3, 'VERIFIED', 'ACTIVE')
           ON CONFLICT (hostname) DO UPDATE SET workspace_id = $1, status = 'VERIFIED', ssl_status = 'ACTIVE'`,
          [req.tenantContext.workspaceId, customDomain.toLowerCase().trim(), token]
        );
      }
      return res.status(200).json({ status: 'SUCCESS', message: 'Workspace settings updated successfully.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // SUPER-ADMIN PLATFORM DOMAIN
  // ==========================================
  app.get('/api/v1/admin/kpis', async (req: Request, res: Response) => {
    try {
      const usersCount = await query('SELECT COUNT(*) FROM users');
      const wsCount = await query('SELECT COUNT(*) FROM workspaces');
      const cardsCount = await query('SELECT COUNT(*) FROM cards WHERE status = \'PUBLISHED\'');
      const mrrRes = await query(
        `SELECT COALESCE(SUM(p.price_inr), 0) as mrr
         FROM subscriptions s
         JOIN plans p ON s.plan_id = p.id
         WHERE s.status = 'ACTIVE'`
      );

      return res.status(200).json({
        data: {
          totalUsers: parseInt(usersCount.rows[0].count, 10),
          totalWorkspaces: parseInt(wsCount.rows[0].count, 10),
          publishedCards: parseInt(cardsCount.rows[0].count, 10),
          monthlyRevenue: parseInt(mrrRes.rows[0].mrr, 10)
        }
      });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/admin/cards/:publicId/suspend', async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const updateRes = await query('UPDATE cards SET status = \'SUSPENDED\', updated_at = CURRENT_TIMESTAMP WHERE public_id = $1 RETURNING id', [publicId]);
      if (updateRes.rowCount === 0) return sendError(res, 404, 'RESOURCE_NOT_FOUND', `Card ID ${publicId} not found.`);

      return res.status(200).json({ status: 'SUCCESS', message: `Card ${publicId} has been SUSPENDED globally in database.` });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  // ==========================================
  // CONTACT & INQUIRIES DOMAIN
  // ==========================================
  app.post('/api/v1/contact/submit', async (req: Request, res: Response) => {
    try {
      const { fullName, email, subject, message } = req.body;
      if (!fullName || !email || !message) {
        return sendError(res, 400, 'INVALID_INPUT', 'Name, email, and message are required.');
      }
      const inqRes = await query(
        `INSERT INTO contact_inquiries (full_name, email, subject, message, status)
         VALUES ($1, $2, $3, $4, 'NEW') RETURNING id`,
        [fullName, email, subject || 'General Inquiry', message]
      );
      return res.status(201).json({ status: 'SUCCESS', inquiryId: inqRes.rows[0].id, message: 'Your message has been received.' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.post('/api/v1/webhooks/billing/razorpay', async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const adapter = new RazorpayAdapter();
      const isValid = adapter.verifyWebhookSignature(JSON.stringify(req.body), signature || '', env.RAZORPAY_WEBHOOK_SECRET || '');

      if (!isValid) {
        return sendError(res, 400, 'WEBHOOK_VERIFICATION_FAILED', 'Invalid Razorpay HMAC signature.');
      }

      const eventId = req.body.event_id || `evt_${crypto.randomBytes(8).toString('hex')}`;
      
      const existing = await query('SELECT id FROM billing_webhook_deliveries WHERE provider_event_id = $1', [eventId]);
      if (existing.rowCount && existing.rowCount > 0) {
        return res.status(200).json({ status: 'PROCESSED', message: 'Event already processed.' });
      }

      await query(
        `INSERT INTO billing_webhook_deliveries (provider, provider_event_id, event_type, payload, status)
         VALUES ('RAZORPAY', $1, $2, $3, 'PROCESSED')`,
        [eventId, req.body.event || 'subscription.charged', JSON.stringify(req.body)]
      );

      return res.status(200).json({ status: 'SUCCESS' });
    } catch (err: any) {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR', err.message);
    }
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Unhandled Exception:', err);
    sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unhandled internal server error occurred.');
  });

  return app;
}
