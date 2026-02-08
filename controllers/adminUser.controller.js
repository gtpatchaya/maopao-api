"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdminUser = exports.deleteAdminUser = exports.updateAdminUser = exports.getAdminUsers = exports.createAdminUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'default_secret';
const createAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, password, role } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const adminUser = yield prismaClient_1.default.adminUser.create({
            data: { name, username, password: hashedPassword, role },
        });
        res.status(201).json({ success: true, data: adminUser });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.createAdminUser = createAdminUser;
const getAdminUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminUsers = yield prismaClient_1.default.adminUser.findMany();
        res.status(200).json({ success: true, data: adminUsers });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getAdminUsers = getAdminUsers;
const updateAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, username, role, isActive } = req.body;
        const adminUser = yield prismaClient_1.default.adminUser.update({
            where: { id: parseInt(id) },
            data: { name, username, role, isActive },
        });
        res.status(200).json({ success: true, data: adminUser });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updateAdminUser = updateAdminUser;
const deleteAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prismaClient_1.default.adminUser.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ success: true, message: 'Admin user deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.deleteAdminUser = deleteAdminUser;
const loginAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const adminUser = yield prismaClient_1.default.adminUser.findUnique({ where: { username } });
        if (!adminUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: adminUser.id, role: adminUser.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.loginAdminUser = loginAdminUser;
