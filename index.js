const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

/* ==============================
   ✅ GLOBAL MIDDLEWARE
============================== */

// Trust proxy (สำคัญมากเวลาอยู่หลัง nginx / plesk)
app.set('trust proxy', 1);

// Debug log (เช็คว่า request เข้า server จริงไหม)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ CORS (ใช้แบบนี้พอ ชัวร์สุด)
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ Preflight
app.options('*', cors());

// ✅ Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(cookieParser());

/* ==============================
   ✅ DEBUG ROUTE (เช็ค deploy)
============================== */
app.get('/__debug', (req, res) => {
  res.json({
    status: "ok",
    message: "Server new version working",
    time: new Date()
  });
});

/* ==============================
   ✅ API ROUTER
============================== */

const v1Router = express.Router();

const API_INFO = {
  name: "MaopaoAPi",
  version: "1.0.10",
  description: "MaopaoAPi",
  author: "Maopao"
};

v1Router.get('/version', (req, res) => {
  res.json({
    status: "success",
    apiVersion: API_INFO.version,
    details: API_INFO
  });
});

/* ==============================
   ✅ LEGAL ROUTES (HTML TERMS)
============================== */

const legalController = require('./controllers/legalController');

v1Router.get('/legal/privacy', legalController.getPrivacyPolicy);
v1Router.get('/legal/terms', legalController.getTermsAndConditions);

/* ==============================
   ✅ AUTH ROUTES
============================== */

const authController = require('./controllers/authController');

v1Router.post('/auth/check-email', authController.checkEmailExists);
v1Router.post('/auth/register', authController.register);
v1Router.post('/auth/login', authController.login);

/* ==============================
   ✅ DEVICE ROUTES
============================== */

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

/* ==============================
   ✅ CALCULATION ROUTES
============================== */

const calculationController = require('./controllers/calculationController');
v1Router.get('/calculations/analysis/:val', calculationController.calculationAlgoholValue);

/* ==============================
   ✅ USER ROUTES
============================== */

const userController = require('./controllers/userController');
v1Router.get('/user/:id', authenticateToken, userController.getById);

/* ==============================
   ✅ MOUNT ROUTER
============================== */

app.use('/api/v1', v1Router);

/* ==============================
   ✅ 404 HANDLER
============================== */

app.use('*', (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    path: req.originalUrl
  });
});

/* ==============================
   ✅ START SERVER
============================== */

app.listen(PORT, () => {
  console.log('--------------------------------------');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🧪 Debug: /__debug`);
  console.log('--------------------------------------');
});
