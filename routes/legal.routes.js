"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const legal_controller_1 = require("../controllers/legal.controller");
const router = express_1.default.Router();
router.get('/privacy', legal_controller_1.legalController.getPrivacyPolicy);
router.get('/terms', legal_controller_1.legalController.getTermsAndConditions);
exports.default = router;
