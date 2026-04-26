const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Set global timezone to Thailand
process.env.TZ = 'Asia/Bangkok';

const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// PARSERS FIRST (Needed for Login)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SERVE ADMIN PAGE FIRST
app.use(express.static(path.join(__dirname, 'public')));
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});
app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Admin Login API (Hardcoded as requested)
app.post('/api/v1/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@mail.com' && password === 'pass@1234') {
    const token = jwt.sign({ id: 'admin', role: 'Admin' }, process.env.JWT_ACCESS_SECRET);
    return res.json({ status: 'success', data: { accessToken: token } });
  }
  res.status(401).json({ status: 'error', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
});

// Upload API (Generic for images, videos, pdfs)
app.post('/api/v1/upload', (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    if (!req.file) return res.status(400).json({ status: 'error', message: 'กรุณาเลือกไฟล์ที่ต้องการอัปโหลด' });
    
    // Return the relative URL
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ status: 'success', data: { 
      url: fileUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } });
  });
});

// Legacy support for 'image' field if old apps are using it
app.post('/api/v1/upload-image', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    if (!req.file) return res.status(400).json({ status: 'error', message: 'กรุณาเลือกไฟล์ภาพ' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ status: 'success', data: { url: fileUrl } });
  });
});

/* =========================
   ✅ CORS CONFIG (ตัวเดียวจบ)
========================= */
/* =========================
   ✅ CORS CONFIG (MANUAL)
========================= */
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://192.168.1.38:5173',
    'http://localhost:5173',
    'https://maopao.site'
  ];

  const origin = req.headers.origin;

  // Allow requests from allowed origins or if no origin (tools)
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // If not in allowed list, reflect origin anyway for testing purposes (or restrict)
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Kuma-Revision');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

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

/* =========================
   LOGGING MIDDLEWARE (ON/OFF via ENABLE_REQUEST_LOGGING)
========================= */
const logMiddleware = require('./middlewares/logMiddleware');
app.use(logMiddleware);


/* =========================
   ROUTER V1
========================= */
const v1Router = express.Router();

const API_INFO = {
  name: "MaopaoAPi",
  version: "1.0.11",
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
const promotionController = require('./controllers/promotionController');
const tutorialController = require('./controllers/tutorialController');
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
   PROMOTION ROUTES
======================== */
v1Router.get('/promotions', promotionController.getPromotions);
v1Router.post('/promotions', authenticateToken, promotionController.createPromotion); // Admin only eventually
v1Router.put('/promotions/:id', authenticateToken, promotionController.updatePromotion);
v1Router.delete('/promotions/:id', authenticateToken, promotionController.deletePromotion);

/* =========================
   TUTORIAL ROUTES (How-to)
========================= */
v1Router.get('/tutorials', tutorialController.getTutorials);
v1Router.get('/tutorials/:id', tutorialController.getTutorialById);
v1Router.post('/tutorials', authenticateToken, tutorialController.createTutorial);
v1Router.put('/tutorials/:id', authenticateToken, tutorialController.updateTutorial);
v1Router.delete('/tutorials/:id', authenticateToken, tutorialController.deleteTutorial);

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
/* =========================
   START SERVER
========================= */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`--------------------------------------`);
    console.log(`Server running: http://localhost:${PORT}`);
    console.log(`Version check: http://localhost:${PORT}/api/v1/version`);
    console.log(`--------------------------------------`);
  });
}

module.exports = app;
