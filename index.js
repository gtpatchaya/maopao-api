const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use(cookieParser());

// Create v1 Router
const v1Router = express.Router();

const API_INFO = {
  name: "MaopaoAPi",
  version: "1.0.10",
  description: "MaopaoAPi",
  author: "Maopao"
};

v1Router.get('/version', (req, res) => {
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
v1Router.get('/legal/privacy', legalController.getPrivacyPolicy);
v1Router.get('/legal/terms', legalController.getTermsAndConditions);

// 3. Auth Routes
const authController = require('./controllers/authController');
v1Router.post('/auth/check-email', authController.checkEmailExists);
v1Router.post('/auth/register', authController.register);
v1Router.post('/auth/login', authController.login);

// 4. Device Routes
const deviceController = require('./controllers/deviceController');

const { authenticateToken } = require('./middlewares/authMiddleware');

v1Router.get('/device/:serialNumber/lastedRecord', authenticateToken, deviceController.getLatestRecordBySerialNumber);
v1Router.get('/device/getByDeviceId/:sn', authenticateToken, deviceController.getDeviceById);

v1Router.get('/device/getBySn/:sn/:userId', authenticateToken, deviceController.getDeviceBySn);
v1Router.get('/device/:serialNumber/records', authenticateToken, deviceController.getDeviceRecordsBySerialNumber);
v1Router.post('/device/data', authenticateToken, deviceController.addDataRecord);
v1Router.post('/device-user/assign', authenticateToken, deviceController.assignDeviceToUser);
v1Router.get('/device-user/devicebyuser/:userId', authenticateToken, deviceController.getDevicesByUserId);

v1Router.get('/device/latestState/:deviceId', authenticateToken, deviceController.getDeviceLatestState);
v1Router.post('/device/updateDeviceId/:sn/:id', authenticateToken, deviceController.updateDeviceId);
v1Router.post('/device/updateName/:sn', authenticateToken, deviceController.updateDeviceName);
v1Router.post('/device/updateDeviceUnit/:sn', authenticateToken, deviceController.updateDeviceUnit);
v1Router.post('/device/updateDeviceSyncInfo/:deviceId', authenticateToken, deviceController.updateDeviceSyncInfo);

// 5. Calculation Routes
const calculationController = require('./controllers/calculationController');
v1Router.get('/calculations/analysis/:val', calculationController.calculationAlgoholValue);

// 6. User Routes
const userController = require('./controllers/userController');
v1Router.get('/user/:id', authenticateToken, userController.getById);

// Mount the v1 router
app.use('/api/v1', v1Router);

// รัน Server
app.listen(PORT, () => {
  console.log(`--------------------------------------`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`Check version at: http://localhost:${PORT}/api/v1/version`);
  console.log(`--------------------------------------`);
});