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
exports.initMockData = void 0;
// src/initMockData.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const SALT_ROUNDS = 10;
const initMockData = () => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prismaClient_1.default.user.findFirst({
        where: { email: 'mock@example.com' },
    });
    if (!existingUser) {
        // Hash password before saving
        const hashedPassword = yield bcryptjs_1.default.hash('securepassword123', SALT_ROUNDS);
        yield prismaClient_1.default.stockDevice.create({
            data: {
                deviceId: 'D-MOCK-DEVICE-001',
                serialNumber: 'MOCK-DEVICE-001',
                createdAt: new Date(),
                lotNo: 'LOT-001',
                companyName: 'Mock Company',
            },
        });
        const user = yield prismaClient_1.default.user.create({
            data: {
                name: 'Mock User',
                email: 'mock@example.com',
                password: hashedPassword,
                role: 'User', // Set default role
            },
        });
        yield prismaClient_1.default.device.create({
            data: {
                serialNumber: 'MOCK-DEVICE-001',
                name: 'Mock Device',
                model: 'X200',
                userId: user.id,
                isActive: true,
                currentValue: 0.01,
                currentUnit: 'mg/L',
                currentAt: new Date(),
                deviceId: 'MOCK-DEVICE-001',
            },
        });
        // Add admin user
        const adminPassword = yield bcryptjs_1.default.hash('P@ssword', SALT_ROUNDS);
        yield prismaClient_1.default.user.create({
            data: {
                name: 'Admin',
                email: 'admin@mail.com',
                password: adminPassword,
                role: 'Admin',
            },
        });
        console.log('✅ Mock user, device, and admin user created');
    }
    else {
        console.log('✅ Mock user already exists');
    }
});
exports.initMockData = initMockData;
