/*
  Warnings:

  - Made the column `tanggalKembali` on table `borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `borrow` MODIFY `tanggalKembali` DATETIME(3) NOT NULL;
