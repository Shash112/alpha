const { query, transaction } = require('../packages/database/dist');
const { hashPassword } = require('../packages/auth/dist');

async function main() {
  const pwdHash = await hashPassword('Password123!');
  console.log('Generated hash:', pwdHash);

  await query('UPDATE users SET password_hash = $1 WHERE email = $2', [pwdHash, 'shashankfrancilla@gmail.com']);

  const existingAlpha = await query('SELECT id FROM users WHERE email = $1', ['shashank@alpha.com']);
  if (existingAlpha.rowCount === 0) {
    await transaction(async (client) => {
      const uRes = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, display_name, email_verified)
         VALUES ($1, $2, 'Shashank', 'Shekhar', 'Shashank', TRUE) RETURNING id`,
        ['shashank@alpha.com', pwdHash]
      );
      const userId = uRes.rows[0].id;
      const wsRes = await client.query(
        `INSERT INTO workspaces (type, name, owner_user_id, status)
         VALUES ('PERSONAL', 'Shashank Workspace', $1, 'ACTIVE') RETURNING id`,
        [userId]
      );
      const wsId = wsRes.rows[0].id;
      const rRes = await client.query(
        `INSERT INTO roles (workspace_id, name, is_system) VALUES ($1, 'Owner', TRUE) RETURNING id`,
        [wsId]
      );
      await client.query(
        `INSERT INTO workspace_memberships (workspace_id, user_id, role_id, status)
         VALUES ($1, $2, $3, 'ACTIVE')`,
        [wsId, userId, rRes.rows[0].id]
      );
      await client.query(
        `INSERT INTO subscriptions (workspace_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end)
         VALUES ($1, 'plan_business_annual', 'INTERNAL', 'sub_demo_alpha', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 year')`,
        [wsId]
      );
    });
  }

  console.log('✅ Users updated and shashank@alpha.com created!');
  process.exit(0);
}

main().catch(console.error);
