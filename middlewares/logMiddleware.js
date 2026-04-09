const prisma = require('../prismaClient');

const logMiddleware = async (req, res, next) => {
  // ดึงค่าการเปิด/ปิด log จาก environment variable (Default: true)
  const isLoggingEnabled = process.env.ENABLE_REQUEST_LOGGING !== 'false';
  
  if (!isLoggingEnabled) {
    return next();
  }

  const start = Date.now();
  
  // ใช้ event 'finish' เพื่อรอให้ response ส่งกลับไปหา user เรียบร้อยแล้วค่อยบันทึก log
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    try {
      // ดึง userId ถ้ามี (จะถูกเซ็ตมาจาก authenticateToken middleware)
      const userId = req.user ? String(req.user.id) : null;

      // กรองข้อมูลที่อาจจะไม่ต้องการ log (เช่น password ใน body)
      let logBody = null;
      if (req.method !== 'GET' && req.body) {
        const bodyCopy = { ...req.body };
        if (bodyCopy.password) bodyCopy.password = '******';
        logBody = JSON.stringify(bodyCopy);
      }

      await prisma.requestLog.create({
        data: {
          method: req.method,
          url: req.originalUrl || req.url,
          headers: JSON.stringify(req.headers),
          body: logBody,
          query: Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : null,
          ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userId: userId,
          statusCode: res.statusCode,
          duration: duration,
        },
      });
    } catch (error) {
      // ใช้ console.error เพื่อไม่ให้ error ในการ log ขัดขวางการทำงานของ API หลัก
      console.error('[RequestLog Error]:', error.message);
    }
  });

  next();
};

module.exports = logMiddleware;
