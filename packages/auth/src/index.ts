import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateEnv, SYSTEM_CONSTANTS } from '@alpha/config';
import { TenantContext } from '@alpha/types';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SYSTEM_CONSTANTS.PASSWORD_SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JwtAccessTokenPayload {
  sub: string; // userId
  email: string;
  defaultWorkspaceId?: string;
  isSuperAdmin?: boolean;
}

export interface JwtRefreshTokenPayload {
  sub: string;
  tokenVersion: number;
}

export function generateAccessToken(payload: JwtAccessTokenPayload): string {
  const env = validateEnv();
  return jwt.sign(payload, env.JWT_SECRET || 'secret', { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JwtRefreshTokenPayload): string {
  const env = validateEnv();
  return jwt.sign(payload, env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  const env = validateEnv();
  return jwt.verify(token, env.JWT_SECRET || 'secret') as unknown as JwtAccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshTokenPayload {
  const env = validateEnv();
  return jwt.verify(token, env.JWT_REFRESH_SECRET || 'refresh_secret') as unknown as JwtRefreshTokenPayload;
}

export function extractTenantContext(req: any): TenantContext | null {
  const workspaceId = req.headers['x-workspace-id'] || req.params?.workspaceId;
  const user = req.user as JwtAccessTokenPayload | undefined;

  if (!user || !workspaceId) return null;

  return {
    workspaceId: String(workspaceId),
    userId: user.sub,
    isDelegated: Boolean(req.headers['x-delegated-by']),
    delegatedByResellerId: req.headers['x-delegated-by'] ? String(req.headers['x-delegated-by']) : undefined
  };
}
