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
exports.userController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const auth_controller_1 = require("./auth.controller");
exports.userController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, dateOfBirth } = req.body;
            // Check if email already exists
            const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                res
                    .status(400)
                    .json((0, response_1.errorResponse)(400, "อีเมลนี้มีผู้ลงทะเบียนไปแล้ว"));
                return;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const temp = new Date(dateOfBirth);
            const { consents } = req.body;
            // Prepare consent data if provided
            const consentData = Array.isArray(consents) && consents.length > 0
                ? {
                    create: consents.map((c) => {
                        let mappedType;
                        if (c.consentType === 'terms_and_conditions')
                            mappedType = client_1.ConsentType.terms;
                        else if (c.consentType === 'privacy_policy')
                            mappedType = client_1.ConsentType.privacy;
                        else if (c.consentType === 'cookie_policy')
                            mappedType = client_1.ConsentType.cookie;
                        // Fallback or default if simple matching
                        if (!mappedType && Object.values(client_1.ConsentType).includes(c.consentType)) {
                            mappedType = c.consentType;
                        }
                        if (!mappedType) {
                            throw new Error(`Invalid consent type: ${c.consentType}`);
                        }
                        return {
                            consentType: mappedType,
                            policyVersion: c.policyVersion,
                            acceptedBy: c.acceptedBy || "web",
                            acceptedAt: new Date(),
                            ipAddress: req.ip || null,
                            userAgent: req.headers["user-agent"] || null,
                        };
                    }),
                }
                : undefined;
            const user = yield prismaClient_1.default.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    dateOfBirth: temp,
                    consents: consentData,
                },
            });
            // Generate tokens
            const tokens = (0, auth_controller_1.generateTokens)({
                userId: user.id,
                email: user.email,
            });
            // Set refresh token in HTTP-only cookie
            res.cookie("refreshToken", tokens.refreshToken, auth_1.cookieOptions);
            res.status(201).json((0, response_1.successResponse)(201, "User created", {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken: tokens.accessToken,
            }));
        }
        catch (error) {
            res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield prismaClient_1.default.user.findMany();
            res.status(200).json((0, response_1.successResponse)(200, "Success", users));
        }
        catch (error) {
            res.status(500).json({ error: "Error fetching users" });
        }
    }),
    getById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield prismaClient_1.default.user.findUnique({
                where: { id: req.params.id },
            });
            if (user) {
                const responseData = {
                    email: user.email,
                    name: user.name,
                    dateOfBirth: user.dateOfBirth,
                };
                res.status(200).json((0, response_1.successResponse)(200, "Success", responseData));
            }
            else {
                res.status(404).json((0, response_1.successResponse)(404, "User not found", null));
            }
        }
        catch (error) {
            res.status(500).json((0, response_1.successResponse)(500, "Internal server error", null));
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email } = req.body;
            const user = yield prismaClient_1.default.user.update({
                where: { id: req.params.id },
                data: { name, email },
            });
            res.status(200).json((0, response_1.successResponse)(200, "User updated", user));
        }
        catch (error) {
            res.status(500).json({ error: "Error updating user" });
        }
    }),
    remove: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prismaClient_1.default.user.delete({
                where: { id: req.params.id },
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting user" });
        }
    }),
};
