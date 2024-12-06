/*
  Warnings:

  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `task`;

-- CreateTable
CREATE TABLE `barang` (
    `idBarang` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `kategori` VARCHAR(191) NOT NULL DEFAULT '',
    `lokasi` VARCHAR(191) NOT NULL DEFAULT '',
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idBarang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
