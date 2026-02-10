const prisma = require('../prismaClient');
const { successResponse, errorResponse } = require('../utils/response');
const { randomUUID: v4 } = require('crypto');

const getLatestRecordBySerialNumber = async (req, res, next) => {
  try {
    const { serialNumber } = req.params;

    // 1. ค้นหา Device พร้อมดึง "สถานะล่าสุด" (include latestState)
    // การทำแบบนี้ Database ไม่ต้องไปไล่เรียงลำดับ DataRecord เป็นล้านแถว
    const device = await prisma.device.findUnique({
      where: { serialNumber },
      include: { latestState: true }
    });

    if (!device) {
      res.status(404).json(successResponse(404, "Device not found", null));
      return;
    }

    // 2. เช็คว่ามีข้อมูลล่าสุดหรือไม่
    if (!device.latestState) {
      // กรณีอุปกรณ์ใหม่ ยังไม่เคยส่งค่ามาเลย
      res.status(200).json(successResponse(200, "No record found", null));
      return;
    }

    // 3. ดึงข้อมูล DataRecord ตัวเต็ม
    // เราใช้ข้อมูลจาก latestState เป็น "ลายแทง" เพื่อเจาะจงไปเอาแถวนั้นเลย (Index Lookup)
    // เร็วกว่าการ orderBy เพราะเป็นการระบุค่าที่เจาะจง (Exact Match)
    const latestRecord = await prisma.dataRecord.findFirst({
      where: {
        deviceId: device.id,
        timestamp: device.latestState.timestamp,
        recordNumber: device.latestState.recordNumber,
        sessionId: device.latestState.sessionId
      },
    });

    res
      .status(200)
      .json(
        successResponse(
          200,
          latestRecord ? "Success" : "Record detail missing",
          latestRecord
        )
      );

  } catch (error) {
    console.error("❌ Get latest record error:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const assignDeviceToUser = async (req, res) => {
  try {
    const { sn, userId } = req.body;

    if (!sn || !userId) {
      return res.status(400).json(errorResponse(400, 'Serial number and user ID are required'));
    }

    // ตรวจสอบว่า userId มีอยู่ในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json(errorResponse(404, 'User not found'));
    }

    // อัปเดต userId ใน device
    const updatedDevice = await prisma.device.update({
      where: { serialNumber: sn },
      data: {
        userId,
        status: 'Owner'
      },
      include: { User: true },
    });

    res.status(200).json(successResponse(200, 'Success', updatedDevice));
  } catch (error) {
    console.error('Error assigning device to user:', error);
    res.status(500).json(errorResponse(500, 'Internal server error'));
  }
};


const updateDeviceId = async (req, res) => {
  try {
    const { id, sn } = req.params;
    const updated = await prisma.device.update({
      where: { serialNumber: sn },
      data: { deviceId: id },
    });

    res.status(200).json(successResponse(200, "Device id updated", updated));
  } catch (error) {
    console.error("Error updating device id:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const updateDeviceName = async (req, res) => {
  try {
    const { sn } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json(errorResponse(400, "Device name is required"));
    }

    const updated = await prisma.device.update({
      where: { serialNumber: sn },
      data: { name },
    });

    res.status(200).json(successResponse(200, "Device name updated", updated));
  } catch (error) {
    console.error("Error updating device name:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const updateDeviceSyncInfo = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const updated = await prisma.device.update({
      where: { deviceId },
      data: {
        isSyncInfo: true,
        currentAt: new Date(),
      },
    });

    res.status(200).json(successResponse(200, "Sync info updated", true));
  } catch (error) {
    console.error("Error updating sync info:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const getDevicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(200).json(successResponse(200, 'Success', []));
    }

    // Get all devices for the user
    const devices = await prisma.device.findMany({
      where: { userId },
      include: { User: true }
    });

    return res.status(200).json(successResponse(200, 'Success', devices));
  } catch (error) {
    console.error('Error getting user devices:', error);
    res.status(500).json(errorResponse(500, 'Success'));
  }
};


const getDeviceLatestState = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const device = await prisma.device.findUnique({
      where: { id: +deviceId },
      include: { latestState: true },
    });

    if (!device) {
      res.status(404).json(successResponse(404, "Device not found", null));
      return;
    }

    res.status(200).json(successResponse(200, "Success", device.latestState));
  } catch (error) {
    console.error("Error getting device latest state:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const getDeviceRecordsBySerialNumber = async (req, res, next) => {
  try {
    const { serialNumber } = req.params;

    // คำนวณวันที่สิ้นสุด (ปีปัจจุบัน + 2)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    const device = await prisma.device.findUnique({
      where: { serialNumber }
    });

    if (!device) {
      res.status(404).json(successResponse(404, "Device not found", null));
      return;
    }

    // ดึง sessionId ล่าสุด โดยต้องไม่เกินปีที่กำหนดด้วย
    // Note: The user code uses `sessionId: { not: '' }` which assumes sessionId is a string.
    const latestSessionRecord = await prisma.dataRecord.findFirst({
      where: {
        deviceId: device.id,
        sessionId: { not: '' },
        timeUpdate: { lt: maxDate } // กรองวันที่ตรงนี้
      },
      orderBy: [{ timeUpdate: "desc" }],
      select: { sessionId: true }
    });

    if (!latestSessionRecord) {
      res.status(200).json(successResponse(200, "No records found within the time limit", []));
      return;
    }

    // ดึงข้อมูลทั้งหมดจาก session ล่าสุด
    const records = await prisma.dataRecord.findMany({
      where: {
        deviceId: device.id,
        sessionId: latestSessionRecord.sessionId,
        timeUpdate: { lt: maxDate } // กรองวันที่ย้ำอีกครั้งเพื่อความชัวร์
      },
      orderBy: { timeUpdate: "desc" }
    });

    res.status(200).json(successResponse(200, "Success", records));
  } catch (error) {
    console.error("Error getting device records:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const addDataRecord = async (req, res, next) => {
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
    const device = await prisma.device.findUnique({
      where: { serialNumber },
      include: { latestState: true },
    });

    if (!device) {
      res.status(404).json(successResponse(404, 'Device not found', null));
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
      sessionToSave = v4();
    } else {
      // CASE B: มีข้อมูลเก่า
      const lastTimestamp = new Date(lastState.timestamp).getTime();
      const lastRecordNum = lastState.recordNumber;

      // --- เช็ค Duplicate (แบบฉลาดขึ้น) ---
      if (lastState) {
        const isSameRecord = recordNumber === lastState.recordNumber;
        const isSameTime = reqTimestamp === new Date(lastState.timestamp).getTime();

        // จะข้าม (Skip) ก็ต่อเมื่อ "เลขเดิม" และ "เวลาเดิม" เท่านั้น
        if (isSameRecord && isSameTime) {
          res.status(200).json(successResponse(200, 'Record skipped (identical)', lastState));
          return;
        }
      }

      // Default: ใช้ Session เดิม
      sessionToSave = lastState.sessionId;

      // เช็คว่าข้อมูลใหม่กว่าข้อมูลล่าสุดหรือไม่
      if (reqTimestamp > lastTimestamp) {
        // เงื่อนไข Rollover: เลข record น้อยลง (เช่น 1000 -> 1) -> ขึ้น Session ใหม่
        if (recordNumber < lastRecordNum) {
          sessionToSave = v4();
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
    const [record, updatedState] = await prisma.$transaction([

      // 3.1 Insert History
      prisma.dataRecord.create({
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
      prisma.deviceLatestState.upsert({
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

    res.status(200).json(successResponse(200, 'Record added successfully', record));

  } catch (error) {
    next(error);
  }
};


const getDeviceById = async (req, res, next) => {
  try {
    const { sn } = req.params;

    const device = await prisma.device.findUnique({
      where: { serialNumber: sn },
    });

    if (!device) {
      res.status(404).json(successResponse(404, "Device not found", null));
      return;
    }

    res.status(200).json(successResponse(200, "Success", device));
  } catch (error) {
    next(error);
  }
};


const updateDeviceUnit = async (req, res) => {
  try {
    const { sn } = req.params;
    const { unit } = req.body;

    console.log('serialNumber:', sn);

    if (unit === null || unit === undefined) {
      // Note: User used errorResponse(400, "Unit is required") without res.status(400) in the snippet,
      // but standard is res.status(400).json(...)
      // User snippet: res.status(400).json(errorResponse(400, "Unit is required"));
      // I will follow the user snippet.
      res.status(400).json(errorResponse(400, "Unit is required"));
      return;
    }

    const updated = await prisma.device.update({
      where: { serialNumber: sn },
      data: {
        currentUnit: unit,
        currentAt: new Date(),
      },
    });

    res.status(200).json(successResponse(200, "Unit updated", updated));
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};


const getDeviceBySn = async (req, res, next) => {
  try {
    const { sn, userId } = req.params;

    console.log("getDeviceBySn->", { sn });

    if (!sn) {
      res.status(400).json(successResponse(400, "Serial number is required", null));
      return;
    }

    const device = await prisma.device.findFirst({
      where: {
        serialNumber: sn,
      },
    });

    if (!device) {
      res.status(404).json(successResponse(404, "Device not found", null));
      return;
    }

    if (device.userId === null || device.userId === userId) {
      if (device.userId === null) {
        await prisma.device.update({
          where: { serialNumber: sn },
          data: { userId },
        });
        // Note: Logic continues to return 'device' (the one found before update)
      }
      res.status(200).json(successResponse(200, "Success", device));
    } else {
      res.status(403).json(successResponse(403, "Device is already registered by another user", null));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLatestRecordBySerialNumber,
  assignDeviceToUser,
  updateDeviceId,
  updateDeviceName,
  updateDeviceSyncInfo,
  getDevicesByUserId,
  getDeviceLatestState,
  getDeviceRecordsBySerialNumber,
  addDataRecord,
  getDeviceById,
  updateDeviceUnit,
  getDeviceBySn,
};










