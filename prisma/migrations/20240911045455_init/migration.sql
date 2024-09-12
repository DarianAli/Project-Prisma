-- CreateTable
CREATE TABLE `admin` (
    `idAdmin` INTEGER NOT NULL AUTO_INCREMENT,
    `pass` VARCHAR(191) NOT NULL DEFAULT '',
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_idAdmin_key`(`idAdmin`),
    PRIMARY KEY (`idAdmin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelanggan` (
    `idPelanggan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` TEXT NOT NULL DEFAULT '',
    `nomorHp` INTEGER NOT NULL DEFAULT 0,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pelanggan_idPelanggan_key`(`idPelanggan`),
    PRIMARY KEY (`idPelanggan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjual` (
    `idPenjual` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `username` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` TEXT NOT NULL DEFAULT '',
    `nomorHp` INTEGER NOT NULL DEFAULT 0,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `penjual_idPenjual_key`(`idPenjual`),
    PRIMARY KEY (`idPenjual`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hewan` (
    `idHewan` INTEGER NOT NULL AUTO_INCREMENT,
    `berat` INTEGER NOT NULL DEFAULT 0,
    `umur` INTEGER NOT NULL DEFAULT 0,
    `harga` INTEGER NOT NULL DEFAULT 0,
    `kategori` ENUM('SAPI', 'KAMBING', 'PILIH') NOT NULL DEFAULT 'PILIH',
    `jenis` VARCHAR(191) NOT NULL DEFAULT '',
    `foto` VARCHAR(191) NOT NULL DEFAULT '',
    `penjualId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hewan_idHewan_key`(`idHewan`),
    PRIMARY KEY (`idHewan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `idTransaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `tglTransaksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pelangganId` INTEGER NULL,
    `total` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('SUDAH', 'BELUM', 'MENUNGGU') NOT NULL DEFAULT 'MENUNGGU',
    `hewanId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaksi_idTransaksi_key`(`idTransaksi`),
    PRIMARY KEY (`idTransaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailTransaksi` (
    `idDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `transaksiId` INTEGER NULL,
    `hewanId` INTEGER NULL,
    `jumlah` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `detailTransaksi_idDetail_key`(`idDetail`),
    PRIMARY KEY (`idDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hewan` ADD CONSTRAINT `hewan_penjualId_fkey` FOREIGN KEY (`penjualId`) REFERENCES `penjual`(`idPenjual`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `pelanggan`(`idPelanggan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_hewanId_fkey` FOREIGN KEY (`hewanId`) REFERENCES `hewan`(`idHewan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_transaksiId_fkey` FOREIGN KEY (`transaksiId`) REFERENCES `transaksi`(`idTransaksi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_hewanId_fkey` FOREIGN KEY (`hewanId`) REFERENCES `hewan`(`idHewan`) ON DELETE SET NULL ON UPDATE CASCADE;
