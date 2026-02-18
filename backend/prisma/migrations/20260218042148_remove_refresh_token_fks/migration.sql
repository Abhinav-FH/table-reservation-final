-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `fk_refresh_token_admin`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `fk_refresh_token_customer`;

-- CreateIndex
CREATE INDEX `refresh_tokens_user_id_user_type_idx` ON `refresh_tokens`(`user_id`, `user_type`);
