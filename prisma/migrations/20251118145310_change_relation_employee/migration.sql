/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."employees" DROP CONSTRAINT "employees_department_id_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "avatar_url",
DROP COLUMN "department_id";
