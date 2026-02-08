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
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("./config/passport");
const swagger_1 = require("./config/swagger");
const prismaClient_1 = __importDefault(require("./prismaClient"));
const adminUser_route_1 = __importDefault(require("./routes/adminUser.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const calculations_route_1 = __importDefault(require("./routes/calculations.route"));
const device_routes_1 = __importDefault(require("./routes/device.routes"));
const deviceUser_routes_1 = __importDefault(require("./routes/deviceUser.routes"));
const legal_routes_1 = __importDefault(require("./routes/legal.routes"));
const stockDevice_route_1 = __importDefault(require("./routes/stockDevice.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const app = (0, express_1.default)();
// Middleware
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ✅ CORS middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log(`🌐 CORS Request from: ${origin || 'Unknown'}`);
        // Allow all origins (Reflecting origin to support credentials)
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'X-File-Name'
    ],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 86400
}));
// ✅ Preflight handler
app.options('*', (0, cors_1.default)());
// ✅ Custom logger for requests and responses
app.use((req, res, next) => {
    console.log("📥 Incoming Request:", {
        url: req.url,
        method: req.method,
        body: req.body,
    });
    const originalSend = res.send;
    res.send = function (body) {
        console.log("📤 Outgoing Response:", {
            statusCode: res.statusCode,
            body,
        });
        return originalSend.call(this, body);
    };
    next();
});
// ✅ Security headers
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});
// ✅ Swagger
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Alcohol Device API Documentation",
}));
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger_1.specs);
});
// ✅ Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Alcohol Device API",
        documentation: "/api-docs",
        version: "1.0.1",
        endpoints: {
            auth: "/api/v1/auth",
            devices: "/api/v1/device",
            users: "/api/v1/user",
            calculations: "/api/v1/calculations",
            deviceUsers: "/api/v1/device-user"
            // stockDevices: "/api/v1/stock-device",
        },
    });
});
// ✅ Health check
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prismaClient_1.default.$queryRaw `SELECT 1 as health_check`;
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: "connected",
            environment: process.env.NODE_ENV || "development"
        });
    }
    catch (error) {
        console.error("❌ Health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: "disconnected",
            error: "Database connection failed"
        });
    }
}));
// ✅ Routes
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/device", device_routes_1.default);
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/device-user", deviceUser_routes_1.default);
app.use("/api/v1/stock-device", stockDevice_route_1.default);
app.use("/api/v1/calculations", calculations_route_1.default);
app.use("/api/v1/admin-user", adminUser_route_1.default); // เพิ่ม route สำหรับ AdminUser
app.use("/api/v1/legal", legal_routes_1.default); // Add legal routes
// ✅ Error handling
app.use(((err, req, res, next) => {
    console.error('❌ Error occurred:', {
        message: err.message,
        status: err.status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method
    });
    if (err.status === 428) {
        return res.status(428).json({
            success: false,
            message: "เซิร์ฟเวอร์ยังไม่พร้อมใช้งาน",
            error: "ขาดการตั้งค่าที่จำเป็น กรุณาติดต่อผู้ดูแลระบบ",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    if (err.status === 401) {
        return res.status(401).json({
            success: false,
            message: "ไม่มีสิทธิ์เข้าใช้งาน",
            error: "กรุณาเข้าสู่ระบบใหม่"
        });
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}));
// ✅ 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.originalUrl
    });
});
exports.default = app;
