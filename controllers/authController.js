const prisma = require('../prismaClient');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { generateTokens, cookieOptions } = require('../utils/auth');
const { successResponse, errorResponse } = require('../utils/response');

const checkEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// ConsentType enum mapping (matching Prisma schema)
const ConsentType = {
  privacy: 'privacy',
  terms: 'terms',
  cookie: 'cookie'
};


// Helper to check environment variables
const checkEnvVariables = () => {
  const missing = [];
  if (!process.env.JWT_ACCESS_SECRET) missing.push("JWT_ACCESS_SECRET");
  if (!process.env.JWT_REFRESH_SECRET) missing.push("JWT_REFRESH_SECRET");
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
};

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, dateOfBirth } = req.body;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json(errorResponse(400, "อีเมลนี้มีผู้ลงทะเบียนไปแล้ว"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const temp = dateOfBirth ? new Date(dateOfBirth) : null;
      const { consents } = req.body;

      // Prepare consent data if provided
      const consentData =
        Array.isArray(consents) && consents.length > 0
          ? {
            create: consents.map((c) => {
              let mappedType;
              if (c.consentType === 'terms_and_conditions') mappedType = ConsentType.terms;
              else if (c.consentType === 'privacy_policy') mappedType = ConsentType.privacy;
              else if (c.consentType === 'cookie_policy') mappedType = ConsentType.cookie;
              // Fallback or default if simple matching
              if (!mappedType && Object.values(ConsentType).includes(c.consentType)) {
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

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          dateOfBirth: temp,
          consents: consentData,
        },
      });

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
      });

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

      res.status(201).json(
        successResponse(201, "User created", {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          accessToken: tokens.accessToken,
        })
      );
    } catch (error) {
      console.error("❌ Register error:", error);
      res.status(500).json(errorResponse(500, error?.message || "Internal server error"));
    }
  },

  login: async (req, res) => {
    try {
      console.log("🔐 Login attempt started");

      // Check environment variables first
      try {
        checkEnvVariables();
      } catch (envError) {
        console.error("❌ Environment variables check failed:", envError);
        const error = new Error("Server configuration error");
        error.status = 428;
        throw error;
      }

      // Validate request body
      const { email, password } = req.body;
      console.log("📧 Login request for email:", email);

      if (!email || !password) {
        return res.status(400).json(errorResponse(400, "กรุณากรอก email และ password"));
      }

      // Find user
      console.log("🔍 Searching for user in database...");
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          dateOfBirth: true,
        },
      });

      if (!user) {
        console.log("❌ User not found for email:", email);
        return res.status(401).json(errorResponse(401, "รหัสผ่านผิด"));
      }

      console.log("✅ User found, verifying password...");
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log("❌ Invalid password for user:", email);
        return res.status(401).json(errorResponse(401, "รหัสผ่านผิด"));
      }

      console.log("✅ Password verified, generating tokens...");
      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
      });

      console.log("✅ Tokens generated successfully");
      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

      // Return success response with access token and user data
      res.status(200).json(
        successResponse(200, "success", {
          accessToken: tokens.accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
          },
        })
      );
      console.log("✅ Login successful for user:", email);
    } catch (error) {
      console.error("❌ Login error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.message,
        });
      }

      // Handle specific error status codes
      if (error.status === 428) {
        return res.status(428).json({
          status: "error",
          message: "เซิร์ฟเวอร์ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
          details: "Server configuration error"
        });
      }

      console.error("❌ Unexpected login error:", error);
      res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  },

  checkEmailExists: async (req, res) => {
    try {
      // Validate request body
      const validationResult = checkEmailSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format",
          errors: validationResult.error.errors,
        });
      }

      const { email } = validationResult.data;

      // Check if user exists with this email
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true } // Only select id for performance
      });

      res.status(200).json({
        status: "success",
        message: "Email check completed",
        data: {
          exists: !!existingUser
        }
      });

      return; // Ensure no further execution

    } catch (error) {
      console.error("❌ Check email error:", error);
      res.status(500).json(errorResponse(500, "Internal server error"));
    }
  }
};

module.exports = authController;
