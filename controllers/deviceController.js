const prisma = require('../prismaClient');
const { successResponse, errorResponse } = require('../utils/response');

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

module.exports = {
  getLatestRecordBySerialNumber,
  assignDeviceToUser,
  updateDeviceId,
  updateDeviceName,
  updateDeviceSyncInfo
};




