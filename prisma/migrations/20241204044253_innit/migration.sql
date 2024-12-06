-- CreateTable
CREATE TABLE `borrow` (
    `idBorrow` INTEGER NOT NULL AUTO_INCREMENT,
    `user` INTEGER NULL,
    `barang` INTEGER NULL,
    `tanggalPinjam` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggalKembali` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idBorrow`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `borrow` ADD CONSTRAINT `borrow_user_fkey` FOREIGN KEY (`user`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrow` ADD CONSTRAINT `borrow_barang_fkey` FOREIGN KEY (`barang`) REFERENCES `barang`(`idBarang`) ON DELETE SET NULL ON UPDATE CASCADE;
