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
exports.updateStockDevice = exports.deleteStockDevice = exports.getStockDeviceByDeviceId = exports.getStockDeviceBySerialNumber = exports.getAllStockDevices = exports.createStockDevice = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const response_1 = require("../utils/response");
const createStockDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber, lotNo, companyName, deviceId } = req.body;
        const existing = yield prismaClient_1.default.stockDevice.findUnique({
            where: { serialNumber },
        });
        if (existing) {
            res.status(409).json((0, response_1.successResponse)(409, 'StockDevice already exists', null));
            return;
        }
        const stockDevice = yield prismaClient_1.default.stockDevice.create({
            data: { serialNumber, lotNo, companyName, deviceId },
        });
        res.status(201).json((0, response_1.successResponse)(201, 'StockDevice created', stockDevice));
    }
    catch (error) {
        next(error);
    }
});
exports.createStockDevice = createStockDevice;
const getAllStockDevices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockDevices = yield prismaClient_1.default.stockDevice.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json((0, response_1.successResponse)(200, 'Success', stockDevices));
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStockDevices = getAllStockDevices;
const getStockDeviceBySerialNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const stockDevice = yield prismaClient_1.default.stockDevice.findUnique({
            where: { serialNumber },
        });
        if (!stockDevice) {
            res.status(404).json((0, response_1.successResponse)(404, 'StockDevice not found', null));
            return;
        }
        res.status(200).json((0, response_1.successResponse)(200, 'Success', stockDevice));
    }
    catch (error) {
        next(error);
    }
});
exports.getStockDeviceBySerialNumber = getStockDeviceBySerialNumber;
const getStockDeviceByDeviceId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId } = req.params;
        const stockDevice = yield prismaClient_1.default.stockDevice.findUnique({
            where: { deviceId },
        });
        if (!stockDevice) {
            res.status(404).json((0, response_1.successResponse)(404, 'StockDevice not found', null));
            return;
        }
        res.status(200).json((0, response_1.successResponse)(200, 'Success', stockDevice));
    }
    catch (error) {
        next(error);
    }
});
exports.getStockDeviceByDeviceId = getStockDeviceByDeviceId;
const deleteStockDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const stockDevice = yield prismaClient_1.default.stockDevice.findUnique({
            where: { serialNumber },
        });
        if (!stockDevice) {
            res.status(404).json((0, response_1.successResponse)(404, 'StockDevice not found', null));
            return;
        }
        yield prismaClient_1.default.stockDevice.delete({ where: { serialNumber } });
        res.status(200).json((0, response_1.successResponse)(200, 'StockDevice deleted', null));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteStockDevice = deleteStockDevice;
const updateStockDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const { lotNo, companyName } = req.body;
        const existing = yield prismaClient_1.default.stockDevice.findUnique({
            where: { serialNumber },
        });
        if (!existing) {
            res.status(404).json((0, response_1.successResponse)(404, 'StockDevice not found', null));
            return;
        }
        const updated = yield prismaClient_1.default.stockDevice.update({
            where: { serialNumber },
            data: Object.assign(Object.assign({}, (lotNo && { lotNo })), (companyName && { companyName })),
        });
        res.status(200).json((0, response_1.successResponse)(200, 'StockDevice updated', updated));
    }
    catch (error) {
        next(error);
    }
});
exports.updateStockDevice = updateStockDevice;
