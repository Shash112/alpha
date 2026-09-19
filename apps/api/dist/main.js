"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const config_1 = require("@alpha/config");
const database_1 = require("@alpha/database");
async function bootstrap() {
    const env = (0, config_1.validateEnv)();
    console.log('⚡ Initializing Database Schema DDL...');
    try {
        await (0, database_1.query)(database_1.FULL_DATABASE_SCHEMA_DDL);
        await (0, database_1.seedDatabase)();
        console.log('✅ Database Schema & Seed initialized successfully.');
    }
    catch (err) {
        console.error('⚠️ Database Initialization Notice:', err);
    }
    const app = (0, server_1.createServer)();
    app.listen(env.PORT, () => {
        console.log(`🚀 Alpha Modular Monolith API running on port ${env.PORT} [Environment: ${env.NODE_ENV}]`);
        console.log(`📡 Health live endpoint: http://localhost:${env.PORT}/health/live`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map