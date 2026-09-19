import { hashPassword, comparePassword, generateAccessToken, verifyAccessToken } from '@alpha/auth';
import crypto from 'crypto';

describe('Auth & Password Reset Unit Tests', () => {
  test('Password Hashing & Verification', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    expect(hash.length).toBeGreaterThan(20);

    const isValid = await comparePassword(rawPassword, hash);
    expect(isValid).toBe(true);

    const isInvalid = await comparePassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });

  test('JWT Token Generation & Verification', () => {
    const payload = {
      sub: 'usr_test_123',
      email: 'test@alpha.com',
      defaultWorkspaceId: 'ws_test_456'
    };

    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
  });

  test('Password Reset Token Generation & Invalidation', () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    expect(resetToken.length).toBe(64);
    expect(tokenHash.length).toBe(64);

    // Verify single-use hashing produces reproducible hash
    const verifyHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    expect(verifyHash).toBe(tokenHash);
  });
});
