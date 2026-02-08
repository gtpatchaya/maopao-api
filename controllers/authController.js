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
