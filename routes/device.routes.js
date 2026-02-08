"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const device_controller_1 = require("../controllers/device.controller");
const dataRecord_controller_1 = require("../controllers/dataRecord.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management and data recording
 */
/**
 * @swagger
 * /api/v1/device/register:
 *   post:
 *     summary: Register a new device
 *     tags: [Devices]
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
 *     responses:
 *       201:
 *         description: Device registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Device'
 *       400:
 *         description: Invalid input or device already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", device_controller_1.registerDevice);
/**
 * @swagger
 * /api/v1/device/getBySn/{sn}/{userId}:
 *   get:
 *     summary: Get device by serial number and user ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: sn
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Device found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/getBySn/:sn/:userId", device_controller_1.getDeviceBySn);
router.get("/latestState/:deviceId", device_controller_1.getDeviceLatestState);
// Protected routes
router.use(auth_middleware_1.authenticateToken);
/**
 * @swagger
 * /api/v1/device:
 *   get:
 *     summary: Get paginated list of devices with filters
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of devices per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by device name
 *       - in: query
 *         name: serialNumber
 *         schema:
 *           type: string
 *         description: Filter by serial number
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filter by model
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Filter by device ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, Owner, changeOwner, repair, failer]
 *         description: Filter by device status
 *     responses:
 *       200:
 *         description: List of devices
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         devices:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Device'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 */
router.get("/", device_controller_1.getPaginatedDevices);
/**
 * @swagger
 * /api/v1/device/{serialNumber}:
 *   delete:
 *     summary: Delete device by serial number
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:serialNumber", device_controller_1.deleteDeviceBySerialNumber);
router.get("/getByDeviceId/:sn", device_controller_1.getDeviceById);
/**
 * @swagger
 * /api/v1/device/data:
 *   post:
 *     summary: Add a single data record
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - alcoholLevel
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "device123"
 *               alcoholLevel:
 *                 type: number
 *                 example: 0.08
 *               location:
 *                 type: string
 *                 example: "Office Building A"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Data record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DataRecord'
 */
router.post("/data", dataRecord_controller_1.addDataRecord);
/**
 * @swagger
 * /api/v1/device/data/bulk:
 *   post:
 *     summary: Add multiple data records
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - records
 *             properties:
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - deviceId
 *                     - alcoholLevel
 *                   properties:
 *                     deviceId:
 *                       type: string
 *                     alcoholLevel:
 *                       type: number
 *                     location:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Data records added successfully
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
 *                         $ref: '#/components/schemas/DataRecord'
 */
router.post("/data/bulk", dataRecord_controller_1.addMultipleDataRecords);
/**
 * @swagger
 * /api/v1/device/{serialNumber}/records:
 *   get:
 *     summary: Get all records for a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Device records retrieved successfully
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
 *                         $ref: '#/components/schemas/DataRecord'
 */
router.get("/:serialNumber/records", device_controller_1.getDeviceRecordsBySerialNumber);
/**
 * @swagger
 * /api/v1/device/{serialNumber}/lastedRecord:
 *   get:
 *     summary: Get latest record for a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Latest record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DataRecord'
 */
router.get("/:serialNumber/lastedRecord", device_controller_1.getLatestRecordBySerialNumber);
// Device update endpoints
router.post("/updateName/:sn", device_controller_1.updateDeviceName);
router.post("/updateDeviceId/:sn/:id", device_controller_1.updateDeviceId);
router.post("/updateSerialNumber/:deviceId", device_controller_1.updateDeviceSerialNumber);
router.post("/updateLastValue/:deviceId", device_controller_1.updateDeviceLastValue);
router.post("/updateDeviceUnit/:sn", device_controller_1.updateDeviceUnit);
router.post("/updateDeviceModel/:deviceId", device_controller_1.updateDeviceModel);
router.post("/updateDeviceSyncInfo/:deviceId", device_controller_1.updateDeviceSyncInfo);
router.post("/updateStatus/:serialNumber", device_controller_1.updateDeviceStatus);
router.post("/update/:serialNumber", device_controller_1.updateDevice);
/**
 * @swagger
 * /api/v1/device/softDelete/{serialNumber}:
 *   delete:
 *     summary: Soft delete device by serial number
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Device serial number
 *     responses:
 *       200:
 *         description: Device soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/softDelete/:serialNumber", device_controller_1.softDeleteDeviceBySerialNumber);
exports.default = router;
