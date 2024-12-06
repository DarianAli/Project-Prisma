/*
  Warnings:

  - You are about to drop the `detailtransaksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hewan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaksi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `detailTransaksi_idHewan_fkey`;

-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `detailTransaksi_idTransaksi_fkey`;

-- DropForeignKey
ALTER TABLE `hewan` DROP FOREIGN KEY `hewan_idPenjual_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `transaksi_idHewan_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `transaksi_idUser_fkey`;

-- DropTable
DROP TABLE `detailtransaksi`;

-- DropTable
DROP TABLE `hewan`;

-- DropTable
DROP TABLE `transaksi`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `task` (
    `idTask` INTEGER NOT NULL AUTO_INCREMENT,
    `types` ENUM('income', 'expense') NOT NULL DEFAULT 'income',
    `amount` INTEGER NOT NULL DEFAULT 0,
    `desciption` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idTask`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
