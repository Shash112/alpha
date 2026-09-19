"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.extractTenantContext = extractTenantContext;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@alpha/config");
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, config_1.SYSTEM_CONSTANTS.PASSWORD_SALT_ROUNDS);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function generateAccessToken(payload) {
    const env = (0, config_1.validateEnv)();
    return jsonwebtoken_1.default.sign(payload, env.JWT_SECRET || 'secret', { expiresIn: '15m' });
}
function generateRefreshToken(payload) {
    const env = (0, config_1.validateEnv)();
    return jsonwebtoken_1.default.sign(payload, env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
}
function verifyAccessToken(token) {
    const env = (0, config_1.validateEnv)();
    return jsonwebtoken_1.default.verify(token, env.JWT_SECRET || 'secret');
}
function verifyRefreshToken(token) {
    const env = (0, config_1.validateEnv)();
    return jsonwebtoken_1.default.verify(token, env.JWT_REFRESH_SECRET || 'refresh_secret');
}
function extractTenantContext(req) {
    const workspaceId = req.headers['x-workspace-id'] || req.params?.workspaceId;
    const user = req.user;
    if (!user || !workspaceId)
        return null;
    return {
        workspaceId: String(workspaceId),
        userId: user.sub,
        isDelegated: Boolean(req.headers['x-delegated-by']),
        delegatedByResellerId: req.headers['x-delegated-by'] ? String(req.headers['x-delegated-by']) : undefined
    };
}
//# sourceMappingURL=index.js.map