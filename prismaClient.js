"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
// Test database connection
prisma.$connect()
    .then(() => {
    console.log("✅ Database connected successfully");
})
    .catch((error) => {
    console.error("❌ Database connection failed:", error);
    console.error("Please check your DATABASE_URL in .env file");
});
exports.default = prisma;
