/*
  Warnings:

  - You are about to alter the column `kategori` on the `barang` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `barang` MODIFY `kategori` ENUM('ELEKTRONIK', 'NON_ELEKTRONIK') NOT NULL DEFAULT 'ELEKTRONIK';
