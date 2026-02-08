"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceUser_controller_1 = require("../controllers/deviceUser.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Device-User
 *   description: Device and user assignment management
 */
router.use(auth_middleware_1.authenticateToken);
/**
 * @swagger
 * /api/v1/device-user/assign:
 *   post:
 *     summary: Assign a device to a user
 *     tags: [Device-User]
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
 *               - userId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "device123"
 *               userId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Device assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input or assignment already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Assign a device to a user
router.post('/assign', deviceUser_controller_1.assignDeviceToUser);
/**
 * @swagger
 * /api/v1/device-user/unassign/{deviceId}:
 *   delete:
 *     summary: Unassign a device from its current user
 *     tags: [Device-User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to unassign
 *     responses:
 *       200:
 *         description: Device unassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Device assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Unassign a device from its current user
router.delete('/unassign/:deviceId', deviceUser_controller_1.unassignDevice);
/**
 * @swagger
 * /api/v1/device-user/devicebyuser/{userId}:
 *   get:
 *     summary: Get all devices assigned to a specific user
 *     tags: [Device-User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Devices retrieved successfully
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
 *                         $ref: '#/components/schemas/Device'
 */
// Get all devices for a specific user
router.get('/devicebyuser/:userId', deviceUser_controller_1.getDevicesByUserId);
/**
 * @swagger
 * /api/v1/device-user/userbydevice/{deviceId}:
 *   get:
 *     summary: Get the user assigned to a specific device
 *     tags: [Device-User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: No user assigned to this device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get the user assigned to a specific device
router.get('/userbydevice/:deviceId', deviceUser_controller_1.getUserByDeviceId);
exports.default = router;
