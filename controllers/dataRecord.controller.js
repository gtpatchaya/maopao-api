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
exports.addMultipleDataRecords = exports.addDataRecord = void 0;
const uuid_1 = require("uuid");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const response_1 = require("../utils/response");
// (Helper เดิมของคุณ)
const addDataRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber, timestamp, value, unit, recordNumber } = req.body;
        // แปลงเวลาให้เป็น Date Object เตรียมไว้ (ใช้ได้ทั้ง Logic และ Save)
        const reqDateObj = new Date(timestamp);
        const reqTimestamp = reqDateObj.getTime();
        // ------------------------------------------------------------------
        // 1. Validate Device + ดึง State ล่าสุด (แก้ไขจุดนี้)
        // ------------------------------------------------------------------
        // เดิม: findUnique device แล้วค่อยไป findFirst dataRecord (ช้า)
        // ใหม่: include: { latestState: true } อ่านทีเดียวได้ครบ (เร็วมาก)
        const device = yield prismaClient_1.default.device.findUnique({
            where: { serialNumber },
            include: { latestState: true },
        });
        if (!device) {
            res.status(404).json((0, response_1.successResponse)(404, 'Device not found', null));
            return;
        }
        // ------------------------------------------------------------------
        // 2. Logic คำนวณ Session (เปลี่ยนแหล่งข้อมูล)
        // ------------------------------------------------------------------
        // ใช้ข้อมูลจากตารางเล็ก (DeviceLatestState) แทนตารางประวัติ (DataRecord)
        const lastState = device.latestState;
        let sessionToSave;
        if (!lastState) {
            // CASE A: ยังไม่เคยมีข้อมูลเลย -> สร้าง Session ใหม่
            sessionToSave = (0, uuid_1.v4)();
        }
        else {
            // CASE B: มีข้อมูลเก่า
            const lastTimestamp = new Date(lastState.timestamp).getTime();
            const lastRecordNum = lastState.recordNumber;
            // --- เช็ค Duplicate (แบบฉลาดขึ้น) ---
            if (lastState) {
                const isSameRecord = recordNumber === lastState.recordNumber;
                const isSameTime = reqTimestamp === new Date(lastState.timestamp).getTime();
                // จะข้าม (Skip) ก็ต่อเมื่อ "เลขเดิม" และ "เวลาเดิม" เท่านั้น
                if (isSameRecord && isSameTime) {
                    res.status(200).json((0, response_1.successResponse)(200, 'Record skipped (identical)', lastState));
                    return;
                }
            }
            // Default: ใช้ Session เดิม
            sessionToSave = lastState.sessionId;
            // เช็คว่าข้อมูลใหม่กว่าข้อมูลล่าสุดหรือไม่
            if (reqTimestamp > lastTimestamp) {
                // เงื่อนไข Rollover: เลข record น้อยลง (เช่น 1000 -> 1) -> ขึ้น Session ใหม่
                if (recordNumber < lastRecordNum) {
                    sessionToSave = (0, uuid_1.v4)();
                }
            }
            // Note: ถ้าเป็นข้อมูลย้อนหลัง เราจะใช้ session เดิมเพื่อให้เกาะกลุ่มกัน
        }
        // ------------------------------------------------------------------
        // 3. Save Data (แก้ไขเป็น Transaction)
        // ------------------------------------------------------------------
        // เราต้องทำ 2 อย่างพร้อมกัน: 
        // 1. เก็บลง History (DataRecord) 
        // 2. อัปเดตค่าล่าสุด (DeviceLatestState)
        const [record, updatedState] = yield prismaClient_1.default.$transaction([
            // 3.1 Insert History
            prismaClient_1.default.dataRecord.create({
                data: {
                    deviceId: device.id,
                    timestamp: reqDateObj,
                    value: +value,
                    unit: unit.toString(),
                    recordNumber: +recordNumber,
                    serialNumber: serialNumber,
                    sessionId: sessionToSave,
                    time_text: timestamp || ""
                },
            }),
            // 3.2 Upsert State (ของใหม่)
            // ถ้ามีอยู่แล้วให้ update, ถ้าไม่มีให้ create
            prismaClient_1.default.deviceLatestState.upsert({
                where: { deviceId: device.id },
                update: {
                    timestamp: reqDateObj,
                    recordNumber: +recordNumber,
                    sessionId: sessionToSave
                },
                create: {
                    deviceId: device.id,
                    timestamp: reqDateObj,
                    recordNumber: +recordNumber,
                    sessionId: sessionToSave
                },
            }),
        ]);
        res.status(200).json((0, response_1.successResponse)(200, 'Record added successfully', record));
    }
    catch (error) {
        next(error);
    }
});
exports.addDataRecord = addDataRecord;
const addMultipleDataRecords = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { serialNumber, records, sessionId } = req.body;
    try {
        const device = yield prismaClient_1.default.device.findUnique({ where: { serialNumber } });
        if (!device) {
            res.status(404).json({ message: 'Device not found' });
            return;
        }
        // Fetch existing recordNumbers and timestamps for the device
        const existingRecords = yield prismaClient_1.default.dataRecord.findMany({
            where: { deviceId: device.id },
            select: { recordNumber: true, timestamp: true },
        });
        const existingRecordMap = new Map(existingRecords.map((record) => [record.recordNumber, record.timestamp.toISOString()]));
        console.log('Existing Record Map:', existingRecordMap);
        console.log('Incoming Records:', records);
        // Filter out records with duplicate recordNumbers or identical timestamps
        const filteredRecords = records.filter((record) => {
            const recordTimestampUTC = new Date(record.timestamp).toISOString(); // Convert to UTC 0
            return (!existingRecordMap.has(record.recordNumber) &&
                !Array.from(existingRecordMap.values()).includes(recordTimestampUTC));
        });
        if (filteredRecords.length === 0) {
            res.status(200).json((0, response_1.successResponse)(200, 'No new records to add', 0));
            return;
        }
        // Insert filtered records
        const createdRecords = yield prismaClient_1.default.dataRecord.createMany({
            data: filteredRecords.map((record) => ({
                deviceId: device.id,
                timestamp: new Date(record.timestamp).toISOString(), // Ensure UTC 0
                value: record.value,
                unit: record.unit.toString(),
                recordNumber: record.recordNumber,
                sessionId: sessionId || '',
                time_text: record.time_text || ""
            })),
        });
        res.status(200).json((0, response_1.successResponse)(200, createdRecords.count ? 'Records added successfully' : 'No record added', createdRecords.count));
    }
    catch (error) {
        next(error);
    }
});
exports.addMultipleDataRecords = addMultipleDataRecords;
