const { PrismaClient } = require('@prisma/client');

// ท่านี้รองรับทั้ง v6 และ v7 แบบปกติ
const prisma = new PrismaClient();

module.exports = prisma;