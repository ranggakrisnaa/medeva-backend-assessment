-- CreateIndex
CREATE INDEX "employees_full_name_idx" ON "employees"("full_name");

-- CreateIndex
CREATE INDEX "employees_position_id_idx" ON "employees"("position_id");

-- CreateIndex
CREATE INDEX "employees_user_id_idx" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "employees_is_active_idx" ON "employees"("is_active");

-- CreateIndex
CREATE INDEX "employees_created_at_idx" ON "employees"("created_at");

-- CreateIndex
CREATE INDEX "employees_position_id_is_active_idx" ON "employees"("position_id", "is_active");

-- CreateIndex
CREATE INDEX "employees_is_active_created_at_idx" ON "employees"("is_active", "created_at" DESC);

-- CreateIndex
CREATE INDEX "positions_department_id_idx" ON "positions"("department_id");
