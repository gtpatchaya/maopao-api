"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
const index_1 = __importDefault(require("./index"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const PORT = process.env.PORT || 3000;
// Check required environment variables
const requiredEnvs = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
if (missingEnvs.length > 0) {
    console.error("❌ Missing required environment variables:", missingEnvs);
    console.error("Please check your .env file");
    process.exit(1);
}
console.log("✅ Environment variables validated");
// Test database connection before starting server
prismaClient_1.default.$connect()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("✅ Database connection verified");
    // Initialize mock data
    // await initMockData();
    // Start server
    index_1.default.listen(PORT, () => {
        console.log(`🚀 Server ready on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
}))
    .catch((error) => {
    console.error("❌ Failed to start server:");
    console.error("Database connection error:", error);
    console.error("Please check your DATABASE_URL in .env file");
    process.exit(1);
});
