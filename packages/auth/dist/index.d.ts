import { TenantContext } from '@alpha/types';
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export interface JwtAccessTokenPayload {
    sub: string;
    email: string;
    defaultWorkspaceId?: string;
    isSuperAdmin?: boolean;
}
export interface JwtRefreshTokenPayload {
    sub: string;
    tokenVersion: number;
}
export declare function generateAccessToken(payload: JwtAccessTokenPayload): string;
export declare function generateRefreshToken(payload: JwtRefreshTokenPayload): string;
export declare function verifyAccessToken(token: string): JwtAccessTokenPayload;
export declare function verifyRefreshToken(token: string): JwtRefreshTokenPayload;
export declare function extractTenantContext(req: any): TenantContext | null;
//# sourceMappingURL=index.d.ts.map