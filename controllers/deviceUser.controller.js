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
exports.getUserByDeviceId = exports.getDevicesByUserId = exports.unassignDevice = exports.assignDeviceToUser = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const response_1 = require("../utils/response");
const assignDeviceToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sn, userId } = req.body;
        if (!sn || !userId) {
            return res.status(400).json((0, response_1.errorResponse)(400, 'Serial number and user ID are required'));
        }
        // ตรวจสอบว่า userId มีอยู่ในฐานข้อมูล
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json((0, response_1.errorResponse)(404, 'User not found'));
        }
        // อัปเดต userId ใน device
        const updatedDevice = yield prismaClient_1.default.device.update({
            where: { serialNumber: sn },
            data: {
                userId,
                status: 'Owner'
            },
            include: { User: true },
        });
        res.status(200).json((0, response_1.successResponse)(200, 'Success', updatedDevice));
    }
    catch (error) {
        console.error('Error assigning device to user:', error);
        res.status(500).json((0, response_1.errorResponse)(500, 'Internal server error'));
    }
});
exports.assignDeviceToUser = assignDeviceToUser;
const unassignDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        // Check if device exists
        const device = yield prismaClient_1.default.device.findUnique({
            where: { id: Number(deviceId) }
        });
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }
        // Unassign device from user
        const updatedDevice = yield prismaClient_1.default.device.update({
            where: { id: Number(deviceId) },
            data: { userId: "" }
        });
        res.json(updatedDevice);
    }
    catch (error) {
        console.error('Error unassigning device:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.unassignDevice = unassignDevice;
const getDevicesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Check if user exists
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(200).json((0, response_1.successResponse)(200, 'Success', []));
        }
        // Get all devices for the user
        const devices = yield prismaClient_1.default.device.findMany({
            where: { userId },
            include: { User: true }
        });
        return res.status(200).json((0, response_1.successResponse)(200, 'Success', devices));
    }
    catch (error) {
        console.error('Error getting user devices:', error);
        res.status(500).json((0, response_1.errorResponse)(500, 'Success'));
    }
});
exports.getDevicesByUserId = getDevicesByUserId;
const getUserByDeviceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const device = yield prismaClient_1.default.device.findUnique({
            where: { deviceId: deviceId },
            include: { User: true }
        });
        if (!device || !device.User) {
            res.status(200).json((0, response_1.successResponse)(200, 'Success', null));
            return;
        }
        res.status(200).json((0, response_1.successResponse)(200, 'Success', device.User));
    }
    catch (error) {
        console.error('Error getting device user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getUserByDeviceId = getUserByDeviceId;
