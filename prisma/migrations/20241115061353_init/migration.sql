/*
  Warnings:

  - You are about to drop the column `jumlah` on the `detailtransaksi` table. All the data in the column will be lost.
  - You are about to drop the column `customer` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `detailtransaksi` DROP COLUMN `jumlah`;

-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `customer`;
