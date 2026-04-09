const prisma = require('../prismaClient');
const { successResponse, errorResponse } = require('../utils/response');

const tutorialController = {
  /**
   * Get all active tutorials
   */
  getTutorials: async (req, res) => {
    try {
      const tutorials = await prisma.tutorial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json(successResponse(200, "Success", tutorials));
    } catch (error) {
      console.error("❌ Get tutorials error detail:", error);
      res.status(500).json(errorResponse(500, "Internal server error: " + error.message));
    }
  },

  /**
   * Get tutorial by ID
   */
  getTutorialById: async (req, res) => {
    try {
      const { id } = req.params;
      const tutorial = await prisma.tutorial.findUnique({
        where: { id: parseInt(id) }
      });

      if (!tutorial) {
        return res.status(404).json(errorResponse(404, "Tutorial not found"));
      }

      res.status(200).json(successResponse(200, "Success", tutorial));
    } catch (error) {
      console.error("❌ Get tutorial by ID error detail:", error);
      res.status(500).json(errorResponse(500, "Internal server error: " + error.message));
    }
  },

  /**
   * Create a new tutorial (Admin use)
   */
  createTutorial: async (req, res) => {
    try {
      const { title, description, type, fileUrl, thumbnailUrl, isActive } = req.body;

      if (!title || !type) {
        return res.status(400).json(errorResponse(400, "Title and type are required"));
      }

      const tutorial = await prisma.tutorial.create({
        data: {
          title,
          description,
          type, // 'video' or 'pdf'
          fileUrl,
          thumbnailUrl,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      res.status(201).json(successResponse(201, "Tutorial created", tutorial));
    } catch (error) {
      console.error("❌ Create tutorial error detail:", error);
      res.status(500).json(errorResponse(500, "Internal server error: " + error.message));
    }
  },

  /**
   * Update tutorial
   */
  updateTutorial: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const tutorial = await prisma.tutorial.update({
        where: { id: parseInt(id) },
        data: data
      });

      res.status(200).json(successResponse(200, "Tutorial updated", tutorial));
    } catch (error) {
      console.error("❌ Update tutorial error detail:", error);
      res.status(500).json(errorResponse(500, "Internal server error: " + error.message));
    }
  },

  /**
   * Delete tutorial
   */
  deleteTutorial: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.tutorial.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json(successResponse(200, "Tutorial deleted"));
    } catch (error) {
      console.error("❌ Delete tutorial error detail:", error);
      res.status(500).json(errorResponse(500, "Internal server error: " + error.message));
    }
  }
};

module.exports = tutorialController;
