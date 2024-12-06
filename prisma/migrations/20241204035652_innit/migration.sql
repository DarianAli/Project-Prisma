/*
  Warnings:

  - You are about to drop the column `tanggalKembali` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalPinjam` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `tanggalKembali`,
    DROP COLUMN `tanggalPinjam`;
