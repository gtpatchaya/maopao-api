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
exports.getDeviceLatestState = exports.updateDevice = exports.updateDeviceStatus = exports.getDeviceById = exports.getDeviceBySn = exports.updateDeviceSyncInfo = exports.updateDeviceModel = exports.updateDeviceUnit = exports.updateDeviceLastValue = exports.updateDeviceSerialNumber = exports.updateDeviceId = exports.updateDeviceName = exports.getLatestRecordBySerialNumber = exports.getDeviceRecordsBySerialNumber = exports.softDeleteDeviceBySerialNumber = exports.deleteDeviceBySerialNumber = exports.getPaginatedDevices = exports.registerDevice = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const response_1 = require("../utils/response");
const registerDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber, model, deviceId, userId, name } = req.body;
        const existing = yield prismaClient_1.default.device.findUnique({ where: { serialNumber } });
        if (existing) {
            res
                .status(200)
                .json((0, response_1.successResponse)(200, "Device already registered", null));
            return;
        }
        const device = yield prismaClient_1.default.device.create({
            data: { serialNumber, model, deviceId, userId, name, isActive: false },
        });
        res
            .status(200)
            .json((0, response_1.successResponse)(200, "Device registered successfully", device));
    }
    catch (error) {
        next(error);
    }
});
exports.registerDevice = registerDevice;
const getPaginatedDevices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const skip = (page - 1) * itemsPerPage;
        // Build the where clause dynamically
        const where = {};
        if (search && search !== 'undefined') {
            // Normalize search input to lowercase
            const searchLower = search.toLowerCase();
            where.OR = [
                { name: { contains: searchLower } },
                { serialNumber: { contains: searchLower } },
                { model: { contains: searchLower } },
                { deviceId: { contains: searchLower } },
            ];
        }
        if (status && status !== 'undefined' && status !== 'ALL') {
            where.status = status;
        }
        // Fetch paginated devices
        const devices = yield prismaClient_1.default.device.findMany({
            where: Object.assign(Object.assign({}, where), { deletedAt: null }),
            orderBy: { id: 'desc' },
            skip,
            take: itemsPerPage,
        });
        // Count total items
        const totalItems = yield prismaClient_1.default.device.count({ where });
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const result = {
            items: devices,
            pagination: {
                currentPage: page,
                itemsPerPage,
                totalItems,
                totalPages,
            },
        };
        res.status(200).json((0, response_1.successResponse)(200, 'Success', result));
    }
    catch (error) {
        next(error);
    }
});
exports.getPaginatedDevices = getPaginatedDevices;
// Other functions remain unchanged
const deleteDeviceBySerialNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const device = yield prismaClient_1.default.device.findUnique({ where: { serialNumber } });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        yield prismaClient_1.default.device.delete({ where: { serialNumber } });
        res.status(200).json((0, response_1.successResponse)(200, "Device deleted", null));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteDeviceBySerialNumber = deleteDeviceBySerialNumber;
const softDeleteDeviceBySerialNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const device = yield prismaClient_1.default.device.findUnique({ where: { serialNumber } });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        yield prismaClient_1.default.device.update({
            where: { serialNumber },
            data: { deletedAt: new Date() },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Device soft deleted", null));
    }
    catch (error) {
        next(error);
    }
});
exports.softDeleteDeviceBySerialNumber = softDeleteDeviceBySerialNumber;
const getDeviceRecordsBySerialNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        // คำนวณวันที่สิ้นสุด (ปีปัจจุบัน + 2)
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        const device = yield prismaClient_1.default.device.findUnique({
            where: { serialNumber }
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        // ดึง sessionId ล่าสุด โดยต้องไม่เกินปีที่กำหนดด้วย
        const latestSessionRecord = yield prismaClient_1.default.dataRecord.findFirst({
            where: {
                deviceId: device.id,
                sessionId: { not: '' },
                timeUpdate: { lt: maxDate } // กรองวันที่ตรงนี้
            },
            orderBy: [{ timeUpdate: "desc" }],
            select: { sessionId: true }
        });
        if (!latestSessionRecord) {
            res.status(200).json((0, response_1.successResponse)(200, "No records found within the time limit", []));
            return;
        }
        // ดึงข้อมูลทั้งหมดจาก session ล่าสุด
        const records = yield prismaClient_1.default.dataRecord.findMany({
            where: {
                deviceId: device.id,
                sessionId: latestSessionRecord.sessionId,
                timeUpdate: { lt: maxDate } // กรองวันที่ย้ำอีกครั้งเพื่อความชัวร์
            },
            orderBy: { timeUpdate: "desc" }
        });
        res.status(200).json((0, response_1.successResponse)(200, "Success", records));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeviceRecordsBySerialNumber = getDeviceRecordsBySerialNumber;
const getLatestRecordBySerialNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        // 1. ค้นหา Device พร้อมดึง "สถานะล่าสุด" (include latestState)
        // การทำแบบนี้ Database ไม่ต้องไปไล่เรียงลำดับ DataRecord เป็นล้านแถว
        const device = yield prismaClient_1.default.device.findUnique({
            where: { serialNumber },
            include: { latestState: true } // <--- คีย์สำคัญอยู่ตรงนี้
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        // 2. เช็คว่ามีข้อมูลล่าสุดหรือไม่
        if (!device.latestState) {
            // กรณีอุปกรณ์ใหม่ ยังไม่เคยส่งค่ามาเลย
            res.status(200).json((0, response_1.successResponse)(200, "No record found", null));
            return;
        }
        // 3. ดึงข้อมูล DataRecord ตัวเต็ม
        // เราใช้ข้อมูลจาก latestState เป็น "ลายแทง" เพื่อเจาะจงไปเอาแถวนั้นเลย (Index Lookup)
        // เร็วกว่าการ orderBy เพราะเป็นการระบุค่าที่เจาะจง (Exact Match)
        const latestRecord = yield prismaClient_1.default.dataRecord.findFirst({
            where: {
                deviceId: device.id,
                timestamp: device.latestState.timestamp,
                recordNumber: device.latestState.recordNumber,
                sessionId: device.latestState.sessionId
            },
        });
        res
            .status(200)
            .json((0, response_1.successResponse)(200, latestRecord ? "Success" : "Record detail missing", latestRecord));
    }
    catch (error) {
        next(error);
    }
});
exports.getLatestRecordBySerialNumber = getLatestRecordBySerialNumber;
const updateDeviceName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sn } = req.params;
        const { name } = req.body;
        if (!name) {
            res.status(400).json((0, response_1.errorResponse)(400, "Name is required"));
            return;
        }
        const updated = yield prismaClient_1.default.device.update({
            where: { serialNumber: sn },
            data: { name },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Device name updated", updated));
    }
    catch (error) {
        console.error("Error updating device name:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceName = updateDeviceName;
const updateDeviceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, sn } = req.params;
        console.log("updateDeviceId->", { id, sn });
        const updated = yield prismaClient_1.default.device.update({
            where: { serialNumber: sn },
            data: { deviceId: id },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Device id updated", updated));
    }
    catch (error) {
        console.error("Error updating device id:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceId = updateDeviceId;
const updateDeviceSerialNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const { serialNumber } = req.body;
        if (!serialNumber) {
            res.status(400).json((0, response_1.errorResponse)(400, "Serial number is required"));
            return;
        }
        const updated = yield prismaClient_1.default.device.update({
            where: { deviceId },
            data: { serialNumber },
        });
        yield prismaClient_1.default.stockDevice.update({
            where: { deviceId },
            data: { serialNumber },
        });
        res
            .status(200)
            .json((0, response_1.successResponse)(200, "Serial number updated", updated));
    }
    catch (error) {
        console.error("Error updating serial number:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceSerialNumber = updateDeviceSerialNumber;
const updateDeviceLastValue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const { value } = req.body;
        if (value === null || value === undefined) {
            res.status(400).json((0, response_1.errorResponse)(400, "Value is required"));
            return;
        }
        const updated = yield prismaClient_1.default.device.update({
            where: { deviceId },
            data: {
                currentValue: value,
                currentAt: new Date(),
            },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Last value updated", updated));
    }
    catch (error) {
        console.error("Error updating last value:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceLastValue = updateDeviceLastValue;
const updateDeviceUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sn } = req.params;
        const { unit } = req.body;
        console.log('serialNumber:', sn);
        if (unit === null || unit === undefined) {
            res.status(400).json((0, response_1.errorResponse)(400, "Unit is required"));
            return;
        }
        const updated = yield prismaClient_1.default.device.update({
            where: { serialNumber: sn },
            data: {
                currentUnit: unit,
                currentAt: new Date(),
            },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Unit updated", updated));
    }
    catch (error) {
        console.error("Error updating unit:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceUnit = updateDeviceUnit;
const updateDeviceModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const { model } = req.body;
        const updated = yield prismaClient_1.default.device.update({
            where: { deviceId },
            data: {
                model,
                currentAt: new Date(),
            },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Model updated", updated));
    }
    catch (error) {
        console.error("Error updating model:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceModel = updateDeviceModel;
const updateDeviceSyncInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const updated = yield prismaClient_1.default.device.update({
            where: { deviceId },
            data: {
                isSyncInfo: true,
                currentAt: new Date(),
            },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Sync info updated", true));
    }
    catch (error) {
        console.error("Error updating sync info:", error);
        res.status(500).json((0, response_1.errorResponse)(500, "Internal server error"));
    }
});
exports.updateDeviceSyncInfo = updateDeviceSyncInfo;
const getDeviceBySn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sn, userId } = req.params;
        console.log("getDeviceBySn->", { sn });
        if (!sn) {
            res.status(400).json((0, response_1.successResponse)(400, "Serial number is required", null));
            return;
        }
        const device = yield prismaClient_1.default.device.findFirst({
            where: {
                serialNumber: sn,
            },
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        if (device.userId === null || device.userId === userId) {
            if (device.userId === null) {
                yield prismaClient_1.default.device.update({
                    where: { serialNumber: sn },
                    data: { userId },
                });
            }
            res.status(200).json((0, response_1.successResponse)(200, "Success", device));
        }
        else {
            res.status(403).json((0, response_1.successResponse)(403, "Device is already registered by another user", null));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getDeviceBySn = getDeviceBySn;
const getDeviceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sn } = req.params;
        const device = yield prismaClient_1.default.device.findUnique({
            where: { serialNumber: sn },
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        res.status(200).json((0, response_1.successResponse)(200, "Success", device));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeviceById = getDeviceById;
const updateDeviceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const { status } = req.body;
        const validStatuses = ['new', 'Owner', 'changeOwner', 'repair', 'failer'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        const updatedDevice = yield prismaClient_1.default.device.update({
            where: { serialNumber },
            data: { status },
        });
        res.status(200).json({ success: true, data: updatedDevice });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updateDeviceStatus = updateDeviceStatus;
const updateDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const { name, model, deviceId, status } = req.body;
        const device = yield prismaClient_1.default.device.findUnique({ where: { serialNumber } });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        const updatedDevice = yield prismaClient_1.default.device.update({
            where: { serialNumber },
            data: {
                serialNumber,
                name,
                model,
                deviceId,
                status,
            },
        });
        res.status(200).json((0, response_1.successResponse)(200, "Device updated successfully", updatedDevice));
    }
    catch (error) {
        next(error);
    }
});
exports.updateDevice = updateDevice;
const getDeviceLatestState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const device = yield prismaClient_1.default.device.findUnique({
            where: { id: +deviceId },
            include: { latestState: true },
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, "Device not found", null));
            return;
        }
        res.status(200).json((0, response_1.successResponse)(200, "Success", device.latestState));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeviceLatestState = getDeviceLatestState;
