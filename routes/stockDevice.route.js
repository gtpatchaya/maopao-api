"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockDevice_controller_1 = require("../controllers/stockDevice.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Stock Devices
 *   description: Stock device inventory management
 */
/**
 * @swagger
 * /api/v1/stock-device:
 *   post:
 *     summary: Create a new stock device
 *     tags: [Stock Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *               - model
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 example: "SN001"
 *               model:
 *                 type: string
 *                 example: "AlcoSensor Pro"
 *               manufacturer:
 *                 type: string
 *                 example: "AlcoTech"
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               location:
 *                 type: string
 *                 example: "Warehouse A"
 *     responses:
 *       201:
 *         description: Stock device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", stockDevice_controller_1.createStockDevice);
/**
 * @swagger
 * /api/v1/stock-device:
 *   get:
 *     summary: Get all stock devices
 *     tags: [Stock Devices]
 *     responses:
 *       200:
 *         description: List of stock devices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           serialNumber:
 *                             type: string
 *                           model:
 *                             type: string
 *                           manufacturer:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           location:
 *                             type: string
 */
router.get("/", stockDevice_controller_1.getAllStockDevices);
/**
 * @swagger
 * /api/v1/stock-device/{serialNumber}:
 *   get:
 *     summary: Get stock device by serial number
 *     tags: [Stock Devices]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Stock device retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Stock device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:serialNumber", stockDevice_controller_1.getStockDeviceBySerialNumber);
/**
 * @swagger
 * /api/v1/stock-device/device/{deviceId}:
 *   get:
 *     summary: Get stock device by device ID
 *     tags: [Stock Devices]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Stock device retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Stock device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/device/:deviceId", stockDevice_controller_1.getStockDeviceByDeviceId);
/**
 * @swagger
 * /api/v1/stock-device/{serialNumber}:
 *   delete:
 *     summary: Delete stock device by serial number
 *     tags: [Stock Devices]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Stock device deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Stock device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:serialNumber", stockDevice_controller_1.deleteStockDevice);
/**
 * @swagger
 * /api/v1/stock-device/{serialNumber}:
 *   put:
 *     summary: Update stock device by serial number
 *     tags: [Stock Devices]
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock device updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Stock device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:serialNumber", stockDevice_controller_1.updateStockDevice);
exports.default = router;
