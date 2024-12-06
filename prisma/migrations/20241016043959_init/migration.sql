/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `pelanggan` ADD COLUMN `role` ENUM('penjual', 'pelanggan') NOT NULL DEFAULT 'pelanggan',
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `penjual` ADD COLUMN `role` ENUM('penjual', 'pelanggan') NOT NULL DEFAULT 'penjual',
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `admin`;
