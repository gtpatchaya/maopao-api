const express = require('express');
const app = express();
const PORT = 3000;

// บอกให้ Express อ่าน JSON ได้
app.use(express.json());

// --- ข้อมูลจำลอง ---
const API_INFO = {
    name: "MaopaoAPi",
    version: "1.0.0",
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

// 2. Hello World (หน้าแรก)
app.get('/', (req, res) => {
    res.send('Welcome to Basic Node.js API! Try /version or /tasks');
});

// 3. ตัวอย่างการดึงข้อมูลพื้นฐาน
app.get('/tasks', (req, res) => {
    const tasks = [
        { id: 1, task: "Wash dishes" },
        { id: 2, task: "Coding Node.js" }
    ];
    res.json(tasks);
});

// รัน Server
app.listen(PORT, () => {
    console.log(`--------------------------------------`);
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`Check version at: http://localhost:${PORT}/version`);
    console.log(`--------------------------------------`);
});