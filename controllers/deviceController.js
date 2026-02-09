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

module.exports = {
  getLatestRecordBySerialNumber
};
