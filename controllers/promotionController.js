const prisma = require('../prismaClient');
const { successResponse, errorResponse } = require('../utils/response');

const promotionController = {
  /**
   * Get all active promotions
   */
  getPromotions: async (req, res) => {
    try {
      const promotions = await prisma.promotion.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json(successResponse(200, "Success", promotions));
    } catch (error) {
      console.error("❌ Get promotions error:", error);
      res.status(500).json(errorResponse(500, "Internal server error"));
    }
  },

  /**
   * Create a new promotion (Admin use)
   */
  createPromotion: async (req, res) => {
    try {
      const { title, description, imageUrl, linkUrl, isActive } = req.body;

      if (!title) {
        return res.status(400).json(errorResponse(400, "Title is required"));
      }

      const promotion = await prisma.promotion.create({
        data: {
          title,
          description,
          imageUrl,
          linkUrl,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      res.status(201).json(successResponse(201, "Promotion created", promotion));
    } catch (error) {
      console.error("❌ Create promotion error:", error);
      res.status(500).json(errorResponse(500, "Internal server error"));
    }
  },

  /**
   * Update promotion
   */
  updatePromotion: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const promotion = await prisma.promotion.update({
        where: { id: parseInt(id) },
        data: data
      });

      res.status(200).json(successResponse(200, "Promotion updated", promotion));
    } catch (error) {
      console.error("❌ Update promotion error:", error);
      res.status(500).json(errorResponse(500, "Internal server error"));
    }
  },

  /**
   * Delete promotion
   */
  deletePromotion: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.promotion.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json(successResponse(200, "Promotion deleted"));
    } catch (error) {
      console.error("❌ Delete promotion error:", error);
      res.status(500).json(errorResponse(500, "Internal server error"));
    }
  }
};

module.exports = promotionController;
