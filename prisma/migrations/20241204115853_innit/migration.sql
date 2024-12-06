-- AlterTable
ALTER TABLE `borrow` ADD COLUMN `jumlah` INTEGER NOT NULL DEFAULT 0,
    MODIFY `tanggalKembali` DATETIME(3) NULL;
