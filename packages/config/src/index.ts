import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().default('postgresql://alphaadmin:alphapassword@localhost:5432/alphadb?sslmode=disable'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('alpha_jwt_secret_super_secure_key_min_32_bytes_long'),
  JWT_REFRESH_SECRET: z.string().default('alpha_jwt_refresh_secret_super_secure_key_min_32'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  S3_BUCKET_NAME: z.string().default('alpha-dev-media'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().default('mock_access_key'),
  S3_SECRET_ACCESS_KEY: z.string().default('mock_secret_key'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_mock_stripe_secret_key'),
  STRIPE_PUBLISHABLE_KEY: z.string().default('pk_test_mock_stripe_publishable_key'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_mock_stripe_secret'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_mock_key_id'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_test_mock_key_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('whsec_mock_razorpay_secret'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  API_BASE_URL: z.string().default('http://localhost:4000'),
  ADMIN_URL: z.string().default('http://localhost:3001'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validateEnv(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment configuration validation failed:', result.error.format());
    throw new Error('Invalid environment variables configuration');
  }
  return result.data;
}

export const SYSTEM_CONSTANTS = {
  CANONICAL_DOMAIN: 'alpha.com',
  CANONICAL_CARD_PREFIX: '/c/',
  DEFAULT_LOCALE: 'en-US',
  DEFAULT_TIMEZONE: 'UTC',
  DEFAULT_CURRENCY: 'USD',
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const,
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
