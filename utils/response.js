"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(statusCode, message, data) {
    return { statusCode, message, data };
}
function errorResponse(statusCode, message) {
    return { statusCode, message, data: null };
}
