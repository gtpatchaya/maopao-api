"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculations_controller_1 = require("../controllers/calculations.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Calculations
 *   description: Alcohol level calculations and analysis
 */
router.use(auth_middleware_1.authenticateToken);
/**
 * @swagger
 * /api/v1/calculations/analysis/{val}:
 *   get:
 *     summary: Analyze alcohol value
 *     tags: [Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: val
 *         required: true
 *         schema:
 *           type: number
 *         description: Alcohol value to analyze
 *         example: 0.08
 *     responses:
 *       200:
 *         description: Analysis completed successfully
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
 *                         value:
 *                           type: number
 *                           example: 0.08
 *                         status:
 *                           type: string
 *                           example: "Over limit"
 *                         recommendation:
 *                           type: string
 *                           example: "Do not drive"
 *       400:
 *         description: Invalid alcohol value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/analysis/:val", calculations_controller_1.calculationAlgoholValue);
exports.default = router;
