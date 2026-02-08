"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminUser_controller_1 = require("../controllers/adminUser.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: AdminUsers
 *   description: Admin user management
 */
/**
 * @swagger
 * /api/v1/admin-user:
 *   post:
 *     summary: Create a new admin user
 *     tags: [AdminUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/admin-user:
 *   get:
 *     summary: Get all admin users
 *     tags: [AdminUsers]
 *     responses:
 *       200:
 *         description: List of admin users
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/admin-user/{id}:
 *   put:
 *     summary: Update an admin user
 *     tags: [AdminUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Admin user updated successfully
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/admin-user/{id}:
 *   delete:
 *     summary: Delete an admin user
 *     tags: [AdminUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Admin user deleted successfully
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/admin-user/login:
 *   post:
 *     summary: Login as an admin user
 *     tags: [AdminUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/', adminUser_controller_1.createAdminUser);
router.get('/', adminUser_controller_1.getAdminUsers);
router.put('/:id', adminUser_controller_1.updateAdminUser);
router.delete('/:id', adminUser_controller_1.deleteAdminUser);
router.post('/login', adminUser_controller_1.loginAdminUser);
exports.default = router;
