/*
  Warnings:

  - You are about to drop the column `hewanId` on the `detailtransaksi` table. All the data in the column will be lost.
  - You are about to drop the column `transaksiId` on the `detailtransaksi` table. All the data in the column will be lost.
  - You are about to drop the column `jenis` on the `hewan` table. All the data in the column will be lost.
  - You are about to drop the column `penjualId` on the `hewan` table. All the data in the column will be lost.
  - You are about to alter the column `kategori` on the `hewan` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - You are about to drop the column `hewanId` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `pelangganId` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `transaksi` table. All the data in the column will be lost.
  - You are about to drop the `pelanggan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `penjual` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `detailTransaksi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `hewan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `transaksi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `detailTransaksi_hewanId_fkey`;

-- DropForeignKey
ALTER TABLE `detailtransaksi` DROP FOREIGN KEY `detailTransaksi_transaksiId_fkey`;

-- DropForeignKey
ALTER TABLE `hewan` DROP FOREIGN KEY `hewan_penjualId_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `transaksi_hewanId_fkey`;

-- DropForeignKey
ALTER TABLE `transaksi` DROP FOREIGN KEY `transaksi_pelangganId_fkey`;

-- AlterTable
ALTER TABLE `detailtransaksi` DROP COLUMN `hewanId`,
    DROP COLUMN `transaksiId`,
    ADD COLUMN `idHewan` INTEGER NULL,
    ADD COLUMN `idTransaksi` INTEGER NULL,
    ADD COLUMN `uuid` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `hewan` DROP COLUMN `jenis`,
    DROP COLUMN `penjualId`,
    ADD COLUMN `deskripsi` TEXT NOT NULL DEFAULT '',
    ADD COLUMN `idPenjual` INTEGER NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `berat` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `kategori` ENUM('SAPI', 'KAMBING') NOT NULL DEFAULT 'SAPI';

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `hewanId`,
    DROP COLUMN `pelangganId`,
    DROP COLUMN `status`,
    DROP COLUMN `total`,
    ADD COLUMN `idHewan` INTEGER NULL,
    ADD COLUMN `idUser` INTEGER NULL,
    ADD COLUMN `pembayaran` ENUM('TRANSFER', 'COD') NOT NULL DEFAULT 'TRANSFER',
    ADD COLUMN `statusBayar` ENUM('NEW', 'PAID', 'DONE') NOT NULL DEFAULT 'NEW',
    ADD COLUMN `totalBayar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `pelanggan`;

-- DropTable
DROP TABLE `penjual`;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `hp` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` TEXT NOT NULL DEFAULT '',
    `profile` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('Pelanggan', 'Penjual') NOT NULL DEFAULT 'Penjual',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_uuid_key`(`uuid`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `detailTransaksi_uuid_key` ON `detailTransaksi`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `hewan_uuid_key` ON `hewan`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `transaksi_uuid_key` ON `transaksi`(`uuid`);

-- AddForeignKey
ALTER TABLE `hewan` ADD CONSTRAINT `hewan_idPenjual_fkey` FOREIGN KEY (`idPenjual`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_idHewan_fkey` FOREIGN KEY (`idHewan`) REFERENCES `hewan`(`idHewan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_idTransaksi_fkey` FOREIGN KEY (`idTransaksi`) REFERENCES `transaksi`(`idTransaksi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_idHewan_fkey` FOREIGN KEY (`idHewan`) REFERENCES `hewan`(`idHewan`) ON DELETE SET NULL ON UPDATE CASCADE;
