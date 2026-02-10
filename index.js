const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// บอกให้ Express อ่าน JSON ได้
app.use(express.json());
app.use(cookieParser());

// --- ข้อมูลจำลอง ---
const API_INFO = {
  name: "MaopaoAPi",
  version: "1.0.9",
  description: "MaopaoAPi",
  author: "Maopao"
};

app.get('/version', (req, res) => {
  try {
    res.json({
      status: "success",
      apiVersion: API_INFO.version,
      details: API_INFO
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      // details: error.message // Hide details in production usually, but maybe useful for debugging here
    });
  }
});

// Legal Routes
const legalController = require('./controllers/legalController');
app.get('/legal/privacy', legalController.getPrivacyPolicy);
app.get('/legal/terms', legalController.getTermsAndConditions);

// 3. Auth Routes
const authController = require('./controllers/authController');
app.post('/auth/check-email', authController.checkEmailExists);
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// 4. Device Routes
// const deviceController = require('./controllers/deviceController');

// const { authenticateToken } = require('./middlewares/authMiddleware');


// app.get('/device/:serialNumber/lastedRecord', authenticateToken, deviceController.getLatestRecordBySerialNumber);
// app.get('/device/getByDeviceId/:sn', authenticateToken, deviceController.getDeviceById);
// app.get('/device/getBySn/:sn/:userId', authenticateToken, deviceController.getDeviceBySn);
// app.get('/device/:serialNumber/records', authenticateToken, deviceController.getDeviceRecordsBySerialNumber);
// app.post('/device/data', authenticateToken, deviceController.addDataRecord);
// app.post('/device-user/assign', authenticateToken, deviceController.assignDeviceToUser);
// app.get('/device-user/devicebyuser/:userId', authenticateToken, deviceController.getDevicesByUserId);

// ด้านล่างนี้ไม่เกี่ยว
// app.get('/device/latestState/:deviceId', authenticateToken, deviceController.getDeviceLatestState);
// app.post('/device/updateDeviceId/:sn/:id', authenticateToken, deviceController.updateDeviceId);
// app.post('/device/updateName/:sn', authenticateToken, deviceController.updateDeviceName);
// app.post('/device/updateDeviceUnit/:sn', authenticateToken, deviceController.updateDeviceUnit);
// app.post('/device/updateDeviceSyncInfo/:deviceId', authenticateToken, deviceController.updateDeviceSyncInfo);

// // 5. Calculation Routes
// const calculationController = require('./controllers/calculationController');
// app.get('/calculations/analysis/:val', calculationController.calculationAlgoholValue);

// // 6. User Routes
// const userController = require('./controllers/userController');
// app.get('/user/:id', authenticateToken, userController.getById);

// รัน Server
app.listen(PORT, () => {
  console.log(`--------------------------------------`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`Check version at: http://localhost:${PORT}/version`);
  console.log(`--------------------------------------`);
});