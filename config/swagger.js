"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Alcohol Device API',
            version: '1.0.0',
            description: 'API documentation for Alcohol Device Management System',
            contact: {
                name: 'API Support',
                email: 'support@alcoholdevice.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://ble-device-api-otwu.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                googleOAuth: {
                    type: 'oauth2',
                    flows: {
                        authorizationCode: {
                            authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
                            tokenUrl: 'https://oauth2.googleapis.com/token',
                            scopes: {
                                'openid': 'OpenID',
                                'profile': 'Profile information',
                                'email': 'Email address',
                            },
                        },
                    },
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error description',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful',
                        },
                        data: {
                            type: 'object',
                            description: 'Response data',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'user123',
                        },
                        email: {
                            type: 'string',
                            example: 'user@example.com',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        picture: {
                            type: 'string',
                            example: 'https://example.com/profile.jpg',
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'ADMIN'],
                            example: 'USER',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                },
                Device: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'device123',
                        },
                        serialNumber: {
                            type: 'string',
                            example: 'SN001',
                        },
                        model: {
                            type: 'string',
                            example: 'AlcoSensor Pro',
                        },
                        manufacturer: {
                            type: 'string',
                            example: 'AlcoTech',
                        },
                        calibrationDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                        nextCalibrationDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-07-01T00:00:00.000Z',
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
                            example: 'ACTIVE',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                },
                DataRecord: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'record123',
                        },
                        deviceId: {
                            type: 'string',
                            example: 'device123',
                        },
                        userId: {
                            type: 'string',
                            example: 'user123',
                        },
                        alcoholLevel: {
                            type: 'number',
                            example: 0.08,
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                        location: {
                            type: 'string',
                            example: 'Office Building A',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-01T00:00:00.000Z',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API files
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
