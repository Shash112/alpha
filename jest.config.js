module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@alpha/config$': '<rootDir>/packages/config/src',
    '^@alpha/types$': '<rootDir>/packages/types/src',
    '^@alpha/database$': '<rootDir>/packages/database/src',
    '^@alpha/auth$': '<rootDir>/packages/auth/src',
    '^@alpha/entitlements$': '<rootDir>/packages/entitlements/src',
    '^@alpha/billing$': '<rootDir>/packages/billing/src',
    '^@alpha/analytics$': '<rootDir>/packages/analytics/src',
    '^@alpha/notifications$': '<rootDir>/packages/notifications/src',
    '^@alpha/integrations$': '<rootDir>/packages/integrations/src',
    '^@alpha/ui$': '<rootDir>/packages/ui/src'
  },
  testMatch: ['**/tests/**/*.spec.ts']
};
