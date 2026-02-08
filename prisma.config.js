// prisma.config.js
const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  earlyAccess: true, // สำหรับฟีเจอร์ใหม่ใน v7
  datasource: {
    url: process.env.DATABASE_URL,
  },
});