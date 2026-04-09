-- SQL Script for Tutorial Table (How-to instructions)
-- This corresponds to the Tutorial model in schema.prisma

CREATE TABLE IF NOT EXISTS `Tutorial` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT,
    `type` VARCHAR(50) NOT NULL DEFAULT 'video', -- 'video' or 'pdf'
    `fileUrl` TEXT,
    `thumbnailUrl` TEXT,
    `isActive` TINYINT(1) DEFAULT 1,
    `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
