const express = require('express');
const app = express();
const PORT = 3000;

// บอกให้ Express อ่าน JSON ได้
app.use(express.json());

// --- ข้อมูลจำลอง ---
const API_INFO = {
  name: "MaopaoAPi",
  version: "1.0.1",
  description: "MaopaoAPi",
  author: "Maopao"
};

// --- Routes ---

// 1. Get Version (ตามที่ขอมาครับ)
app.get('/version', (req, res) => {
  res.json({
    status: "success",
    apiVersion: API_INFO.version,
    details: API_INFO
  });
});

// รัน Server
app.listen(PORT, () => {
  console.log(`--------------------------------------`);
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(`Check version at: http://localhost:${PORT}/version`);
  console.log(`--------------------------------------`);
});