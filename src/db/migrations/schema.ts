import { pgTable, text, timestamp, unique, boolean, foreignKey, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const employeeRole = pgEnum("employee_role", ['employee', 'supervisor'])
export const shiftAssignmentStatus = pgEnum("shift_assignment_status", ['accepted', 'pending', 'declined'])
export const shiftStatus = pgEnum("shift_status", ['scheduled', 'ongoing', 'completed', 'assigned', 'missed', 'cancelled', 'not_attended', 'partially_filled', 'unassigned', 'holiday'])


export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const auditLog = pgTable("audit_log", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	companyId: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "audit_log_companyId_company_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "audit_log_userId_user_id_fk"
		}),
]);

export const company = pgTable("company", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	name: text().notNull(),
	phone: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: employeeRole().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "company_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const billingInfo = pgTable("billing_info", {
	id: text().primaryKey().notNull(),
	companyId: text(),
	email: text().notNull(),
	secondaryEmail: text("secondary_email"),
	primaryPhone: text("primary_phone"),
	secondaryPhone: text("secondary_phone"),
	address: text().notNull(),
	city: text().notNull(),
	country: text().notNull(),
	accountNo: text("account_no"),
	accountName: text("account_name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "billing_info_companyId_company_id_fk"
		}).onDelete("cascade"),
]);

export const shift = pgTable("shift", {
	id: text().primaryKey().notNull(),
	companyId: text().notNull(),
	siteId: text().notNull(),
	status: shiftStatus().default('unassigned').notNull(),
	rolesRequired: text("roles_required").array().notNull(),
	startAt: timestamp("start_at", { mode: 'string' }).notNull(),
	endAt: timestamp("end_at", { mode: 'string' }).notNull(),
	payRate: numeric("pay_rate").notNull(),
	multiplyer: numeric().notNull(),
	publishedBy: text("published_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "shift_companyId_company_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.publishedBy],
			foreignColumns: [user.id],
			name: "shift_published_by_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [site.id],
			name: "shift_siteId_site_id_fk"
		}).onDelete("cascade"),
]);

export const shiftAssignement = pgTable("shift_assignement", {
	id: text().primaryKey().notNull(),
	shift: text().notNull(),
	employeeId: text().notNull(),
	siteId: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [company.id],
			name: "shift_assignement_employeeId_company_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.shift],
			foreignColumns: [shift.id],
			name: "shift_assignement_shift_shift_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [site.id],
			name: "shift_assignement_siteId_site_id_fk"
		}).onDelete("cascade"),
]);

export const shiftAssignementRequest = pgTable("shift_assignement_request", {
	id: text().primaryKey().notNull(),
	status: shiftAssignmentStatus().default('pending').notNull(),
	employeeId: text().notNull(),
	siteId: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [company.id],
			name: "shift_assignement_request_employeeId_company_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [site.id],
			name: "shift_assignement_request_siteId_site_id_fk"
		}).onDelete("cascade"),
]);

export const site = pgTable("site", {
	id: text().primaryKey().notNull(),
	companyId: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	address: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "site_companyId_company_id_fk"
		}).onDelete("cascade"),
]);
