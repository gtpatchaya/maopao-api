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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prismaClient_1 = __importDefault(require("../prismaClient"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Check if user exists
        const existingUser = yield prismaClient_1.default.user.findUnique({
            where: { email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value },
        });
        if (existingUser) {
            return done(null, existingUser);
        }
        // If user doesn't exist, create new user
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                email: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value,
                name: profile.displayName,
                password: '', // Empty password for Google users
                provider: 'google',
            },
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error);
    }
})));
// Serialize user for the session
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from the session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id },
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
