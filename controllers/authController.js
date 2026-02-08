const prisma = require('../prismaClient');
const { z } = require('zod');

const checkEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const authController = {
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

    } catch (error) {
      console.error("❌ Check email error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
};

module.exports = authController;
