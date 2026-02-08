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
Object.defineProperty(exports, "__esModule", { value: true });
const calculations_controller_1 = require("../controllers/calculations.controller");
// Mock dayjs
jest.mock('dayjs', () => {
    const originalDayjs = jest.requireActual('dayjs');
    const mockDayjs = jest.fn(() => ({
        add: jest.fn().mockReturnThis(),
        toISOString: jest.fn(() => '2025-06-29T15:00:00.000Z'),
        format: jest.fn(() => '2025-06-29 15:00:00'),
        fromNow: jest.fn(() => 'in 2 hours'),
    }));
    Object.assign(mockDayjs, originalDayjs);
    return mockDayjs;
});
describe('calculationAlgoholValue', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let responseJson;
    let responseStatus;
    beforeEach(() => {
        responseJson = jest.fn();
        responseStatus = jest.fn(() => ({ json: responseJson }));
        mockRequest = {};
        mockResponse = {
            status: responseStatus,
            json: responseJson,
        };
        mockNext = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('Input validation', () => {
        it('should return 400 for invalid numeric value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: 'invalid' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 400,
                message: 'Invalid value parameter',
                data: null,
            });
        }));
        it('should return 400 for NaN value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: 'NaN' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(400);
        }));
    });
    describe('Low level (value < 20)', () => {
        it('should return SAFE status for value 0', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '0' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'SAFE',
                    value: 0,
                    status: 'low',
                    waitTime: null,
                },
            });
        }));
        it('should return SAFE status for value 15', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '15' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'SAFE',
                    value: 15,
                    status: 'low',
                    waitTime: null,
                },
            });
        }));
        it('should return SAFE status for value 19', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '19' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'SAFE',
                    value: 19,
                    status: 'low',
                    waitTime: null,
                },
            });
        }));
    });
    describe('Medium level (20 <= value < 50)', () => {
        it('should return WARNING status for value 20', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '20' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'WARNING',
                    value: 20,
                    status: 'medium',
                    waitTime: null,
                },
            });
        }));
        it('should return WARNING status for value 35', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '35' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'WARNING',
                    value: 35,
                    status: 'medium',
                    waitTime: null,
                },
            });
        }));
        it('should return WARNING status for value 49', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '49' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'WARNING',
                    value: 49,
                    status: 'medium',
                    waitTime: null,
                },
            });
        }));
    });
    describe('High level (value >= 50)', () => {
        it('should return DANGER status for value 50 with no wait time', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '50' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 50,
                    status: 'height',
                    waitTime: null,
                },
            });
        }));
        it('should return DANGER status with wait time for value 60', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '60' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 60,
                    status: 'height',
                    waitTime: {
                        rawCalculation: 1,
                        hours: 1,
                        minutes: 0,
                        display: '1 ชั่วโมง',
                        waitUntil: '2025-06-29T15:00:00.000Z',
                        waitUntilFormatted: '2025-06-29 15:00:00',
                        waitUntilRelative: 'in 2 hours',
                    },
                },
            });
        }));
        it('should return DANGER status with wait time for value 70', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '70' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 70,
                    status: 'height',
                    waitTime: {
                        rawCalculation: 2,
                        hours: 2,
                        minutes: 0,
                        display: '2 ชั่วโมง',
                        waitUntil: '2025-06-29T15:00:00.000Z',
                        waitUntilFormatted: '2025-06-29 15:00:00',
                        waitUntilRelative: 'in 2 hours',
                    },
                },
            });
        }));
        it('should return DANGER status with mixed hours and minutes for value 65', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '65' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 65,
                    status: 'height',
                    waitTime: {
                        rawCalculation: 1.5,
                        hours: 1,
                        minutes: 30,
                        display: '1 ชั่วโมง 30 นาที',
                        waitUntil: '2025-06-29T15:00:00.000Z',
                        waitUntilFormatted: '2025-06-29 15:00:00',
                        waitUntilRelative: 'in 2 hours',
                    },
                },
            });
        }));
        it('should return DANGER status with minutes only for value 52', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '52' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 52,
                    status: 'height',
                    waitTime: {
                        rawCalculation: 0.2,
                        hours: 0,
                        minutes: 12,
                        display: '12 นาที',
                        waitUntil: '2025-06-29T15:00:00.000Z',
                        waitUntilFormatted: '2025-06-29 15:00:00',
                        waitUntilRelative: 'in 2 hours',
                    },
                },
            });
        }));
        it('should handle large values correctly for value 100', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '100' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith({
                statusCode: 200,
                message: 'Success',
                data: {
                    textDisplay: 'DANGER',
                    value: 100,
                    status: 'height',
                    waitTime: {
                        rawCalculation: 5,
                        hours: 5,
                        minutes: 0,
                        display: '5 ชั่วโมง',
                        waitUntil: '2025-06-29T15:00:00.000Z',
                        waitUntilFormatted: '2025-06-29 15:00:00',
                        waitUntilRelative: 'in 2 hours',
                    },
                },
            });
        }));
        it('should handle decimal values correctly for value 51.5', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '51.5' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            const response = responseJson.mock.calls[0][0];
            expect(response.data.value).toBe(51.5);
            expect(response.data.status).toBe('height');
            expect(response.data.waitTime.rawCalculation).toBe(0.15);
            expect(response.data.waitTime.hours).toBe(0);
            expect(response.data.waitTime.minutes).toBe(9); // 0.15 * 60 = 9
        }));
    });
    describe('Edge cases', () => {
        it('should handle floating point values', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '49.9' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            const response = responseJson.mock.calls[0][0];
            expect(response.data.status).toBe('medium');
            expect(response.data.textDisplay).toBe('WARNING');
        }));
        it('should handle negative values', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '-10' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            const response = responseJson.mock.calls[0][0];
            expect(response.data.status).toBe('low');
            expect(response.data.textDisplay).toBe('SAFE');
        }));
        it('should handle zero value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { val: '0' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(responseStatus).toHaveBeenCalledWith(200);
            const response = responseJson.mock.calls[0][0];
            expect(response.data.status).toBe('low');
            expect(response.data.textDisplay).toBe('SAFE');
        }));
    });
    describe('Error handling', () => {
        it('should call next with error when exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an error by making dayjs throw
            const mockDayjs = require('dayjs');
            mockDayjs.mockImplementation(() => {
                throw new Error('Test error');
            });
            mockRequest.params = { val: '60' };
            yield (0, calculations_controller_1.calculationAlgoholValue)(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        }));
    });
});
