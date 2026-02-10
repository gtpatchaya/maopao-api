const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

/* =========================
   ✅ CORS CONFIG (ตัวเดียวจบ)
========================= */
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🌐 CORS Origin:", origin);

    // อนุญาตทุก origin (รองรับ credentials)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 86400
};

app.use(cors(corsOptions));

/* =========================
   SECURITY HEADER
========================= */
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

/* =========================
   PARSER
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   ROUTER V1
========================= */
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

/* =========================
   CONTROLLERS
========================= */
const legalController = require('./controllers/legalController');
const authController = require('./controllers/authController');
const deviceController = require('./controllers/deviceController');
const calculationController = require('./controllers/calculationController');
const userController = require('./controllers/userController');
const { authenticateToken } = require('./middlewares/authMiddleware');

/* =========================
   LEGAL ROUTES
========================= */
v1Router.get('/legal/privacy', legalController.getPrivacyPolicy);
v1Router.get('/legal/terms', legalController.getTermsAndConditions);

/* =========================
   AUTH ROUTES
========================= */
v1Router.post('/auth/check-email', authController.checkEmailExists);
v1Router.post('/auth/register', authController.register);
v1Router.post('/auth/login', authController.login);

/* =========================
   DEVICE ROUTES
========================= */
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

/* =========================
   CALCULATION ROUTES
========================= */
v1Router.get('/calculations/analysis/:val', calculationController.calculationAlgoholValue);

/* =========================
   USER ROUTES
========================= */
v1Router.get('/user/:id', authenticateToken, userController.getById);

/* =========================
   MOUNT ROUTER
========================= */
app.use('/api/v1', v1Router);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl
  });
});


/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`--------------------------------------`);
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Version check: http://localhost:${PORT}/api/v1/version`);
  console.log(`--------------------------------------`);
});
