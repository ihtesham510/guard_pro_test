CREATE INDEX "audit_log_companyId" ON "audit_log" USING btree ("companyId");--> statement-breakpoint
CREATE INDEX "audit_log_userId" ON "audit_log" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "employee_userId" ON "company" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_phone_no" ON "company" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_email" ON "company" USING btree ("email");--> statement-breakpoint
CREATE INDEX "shift_siteId" ON "shift" USING btree ("siteId");--> statement-breakpoint
CREATE INDEX "shift_companyId" ON "shift" USING btree ("companyId");--> statement-breakpoint
CREATE INDEX "shift_assignement_shiftId" ON "shift_assignement" USING btree ("shift");--> statement-breakpoint
CREATE INDEX "shift_assignement_siteId" ON "shift_assignement" USING btree ("siteId");--> statement-breakpoint
CREATE INDEX "shift_assignement_employeeId" ON "shift_assignement" USING btree ("employeeId");--> statement-breakpoint
CREATE INDEX "shift_assignement_request_employeeId" ON "shift_assignement_request" USING btree ("employeeId");--> statement-breakpoint
CREATE INDEX "shift_assignement_request_siteId" ON "shift_assignement_request" USING btree ("siteId");--> statement-breakpoint
CREATE INDEX "site_companyId" ON "site" USING btree ("companyId");