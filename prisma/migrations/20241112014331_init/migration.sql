-- DropIndex
DROP INDEX `user_uuid_key` ON `user`;

-- AlterTable
ALTER TABLE `detailtransaksi` MODIFY `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('Pelanggan', 'Penjual', 'admin') NOT NULL DEFAULT 'Penjual';
