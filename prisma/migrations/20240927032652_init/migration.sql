/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `pelanggan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `penjual` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `admin_idAdmin_key` ON `admin`;

-- DropIndex
DROP INDEX `detailTransaksi_idDetail_key` ON `detailtransaksi`;

-- DropIndex
DROP INDEX `hewan_idHewan_key` ON `hewan`;

-- DropIndex
DROP INDEX `pelanggan_idPelanggan_key` ON `pelanggan`;

-- DropIndex
DROP INDEX `penjual_idPenjual_key` ON `penjual`;

-- DropIndex
DROP INDEX `transaksi_idTransaksi_key` ON `transaksi`;

-- AlterTable
ALTER TABLE `pelanggan` ALTER COLUMN `email` DROP DEFAULT;

-- AlterTable
ALTER TABLE `penjual` ALTER COLUMN `email` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `pelanggan_email_key` ON `pelanggan`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `penjual_email_key` ON `penjual`(`email`);
