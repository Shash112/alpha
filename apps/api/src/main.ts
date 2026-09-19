import { createServer } from './server';
import { validateEnv } from '@alpha/config';
import { query, FULL_DATABASE_SCHEMA_DDL, seedDatabase } from '@alpha/database';

async function bootstrap() {
  const env = validateEnv();

  console.log('⚡ Initializing Database Schema DDL...');
  try {
    await query(FULL_DATABASE_SCHEMA_DDL);
    await seedDatabase();
    console.log('✅ Database Schema & Seed initialized successfully.');
  } catch (err) {
    console.error('⚠️ Database Initialization Notice:', err);
  }

  const app = createServer();
  app.listen(env.PORT, () => {
    console.log(`🚀 Alpha Modular Monolith API running on port ${env.PORT} [Environment: ${env.NODE_ENV}]`);
    console.log(`📡 Health live endpoint: http://localhost:${env.PORT}/health/live`);
  });
}

bootstrap();
