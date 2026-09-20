"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_CONSTANTS = exports.EnvSchema = void 0;
exports.validateEnv = validateEnv;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'staging', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().default('postgresql://alphaadmin:alphapassword@localhost:5432/alphadb?sslmode=disable'),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    JWT_SECRET: zod_1.z.string().default('alpha_jwt_secret_super_secure_key_min_32_bytes_long'),
    JWT_REFRESH_SECRET: zod_1.z.string().default('alpha_jwt_refresh_secret_super_secure_key_min_32'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    S3_BUCKET_NAME: zod_1.z.string().default('alpha-dev-media'),
    S3_REGION: zod_1.z.string().default('us-east-1'),
    S3_ENDPOINT: zod_1.z.string().optional(),
    S3_ACCESS_KEY_ID: zod_1.z.string().default('mock_access_key'),
    S3_SECRET_ACCESS_KEY: zod_1.z.string().default('mock_secret_key'),
    STRIPE_SECRET_KEY: zod_1.z.string().default('sk_test_mock_stripe_secret_key'),
    STRIPE_PUBLISHABLE_KEY: zod_1.z.string().default('pk_test_mock_stripe_publishable_key'),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().default('whsec_mock_stripe_secret'),
    RAZORPAY_KEY_ID: zod_1.z.string().default('rzp_test_mock_key_id'),
    RAZORPAY_KEY_SECRET: zod_1.z.string().default('rzp_test_mock_key_secret'),
    RAZORPAY_WEBHOOK_SECRET: zod_1.z.string().default('whsec_mock_razorpay_secret'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:3000'),
    API_BASE_URL: zod_1.z.string().default('http://localhost:4000'),
    ADMIN_URL: zod_1.z.string().default('http://localhost:3001'),
});
function validateEnv() {
    const result = exports.EnvSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Environment configuration validation failed:', result.error.format());
        throw new Error('Invalid environment variables configuration');
    }
    return result.data;
}
exports.SYSTEM_CONSTANTS = {
    CANONICAL_DOMAIN: 'alpha.com',
    CANONICAL_CARD_PREFIX: '/c/',
    DEFAULT_LOCALE: 'en-US',
    DEFAULT_TIMEZONE: 'UTC',
    DEFAULT_CURRENCY: 'USD',
    SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    PAISE_PER_RUPEE: 100,
    CENTS_PER_DOLLAR: 100,
    RESERVED_SLUGS: [
        'admin', 'api', 'login', 'register', 'auth', 'billing', 'pricing', 'support',
        'terms', 'privacy', 'c', 'dashboard', 'settings', 'organization', 'team', 'nfc',
        'qr', 'leads', 'analytics', 'reseller', 'white-label', 'app', 'downloads'
    ],
    PASSWORD_SALT_ROUNDS: 12,
    ACCOUNT_DELETION_GRACE_DAYS: 30,
    MAX_VANITY_ALIAS_LENGTH: 50,
    MIN_VANITY_ALIAS_LENGTH: 3
};
//# sourceMappingURL=index.js.map