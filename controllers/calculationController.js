const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const { successResponse, errorResponse } = require('../utils/response');

dayjs.extend(relativeTime);

const calculationAlgoholValue = async (req, res, next) => {
  try {
    const { val } = req.params;
    const value = Number(val);
    console.log("value", value);
    let textDisplay = "";

    if (isNaN(value)) {
      res
        .status(400)
        .json(successResponse(400, "Invalid value parameter", null));
      return;
    }

    let status = "low";
    if (value > 50) {
      status = "height";
    } else if (value >= 20 && value < 50) {
      status = "medium";
    }

    let waitTime = null;
    if (value > 50) {
      // สูตรการคำนวณ: (ผลลัพธ์ - 50) / 10 = เวลาที่ต้องรอ
      const raw = (value - 50) / 10;
      const hours = Math.floor(raw); // หลักหน่วย = ชั่วโมง
      const decimal = raw - hours; // ส่วนทศนิยม
      const minutes = Math.round(decimal * 60); // ทศนิยม x 60 = นาที

      // ใช้ dayjs คำนวณเวลาปัจจุบัน + เวลาที่ต้องรอ
      const now = dayjs();
      const waitUntil = now.add(hours, "hour").add(minutes, "minute");

      let display = "";
      if (hours > 0) {
        display += `${hours} ชั่วโมง `;
      }
      if (minutes > 0) {
        display += `${minutes} นาที`;
      }

      // ถ้าไม่มีเวลารอ (กรณีที่ value = 50 พอดี)
      if (hours === 0 && minutes === 0) {
        display = "ไม่ต้องรอ";
      }

      waitTime = {
        rawCalculation: raw, // เพิ่มค่าการคำนวณดิบเพื่อตรวจสอบ
        hours,
        minutes,
        display: display.trim(),
        waitUntil: waitUntil.toISOString(), // ex: "2025-05-21T04:36:00.000Z"
        waitUntilFormatted: waitUntil.format("YYYY-MM-DD HH:mm:ss"), // ex: "2025-05-21 11:36:00"
        waitUntilRelative: waitUntil.fromNow(), // ต้องใช้ plugin "relativeTime"
      };
    }

    // กำหนด textDisplay ตาม status
    if (status === "low") {
      textDisplay = "SAFE";
    } else if (status === "medium") {
      textDisplay = "WARNING";
    } else if (status === "height") {
      textDisplay = "DANGER";
    }

    const valAlcohol = value.toFixed(0);

    const response = {
      textDisplay,
      valAlcohol,
      status,
      waitTime,
    };

    res.status(200).json(successResponse(200, "Success", response));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculationAlgoholValue
};
