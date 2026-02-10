const prisma = require('../prismaClient');
const { successResponse, errorResponse } = require('../utils/response');

const getById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }, // Provide the ID directly, assuming it's a string based on Prisma schema (usually UUID or String for id)
      // If it's an integer, use +req.params.id or Number(req.params.id)
      // User snippet: where: { id: req.params.id } -> implies string
    });
    if (user) {
      const responseData = {
        email: user.email,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
      };
      res.status(200).json(successResponse(200, "Success", responseData));
    } else {
      res.status(404).json(successResponse(404, "User not found", null));
    }
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json(errorResponse(500, "Internal server error"));
  }
};

module.exports = {
  getById
};
