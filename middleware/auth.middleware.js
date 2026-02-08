"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                status: 'error',
                message: 'Access token not found',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token',
            });
            return;
        }
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};
exports.authenticateToken = authenticateToken;
