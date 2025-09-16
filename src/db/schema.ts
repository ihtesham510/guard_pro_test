import { pgTable, text, timestamp, boolean, numeric, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const employeeRoleEnum = pgEnum('employee_role', ['employee', 'supervisor'])

export const shiftStatusEnum = pgEnum('shift_status', [
	'scheduled',
	'ongoing',
	'completed',
	'assigned',
	'missed',
	'cancelled',
	'not_attended',
	'partially_filled',
	'unassigned',
	'holiday',
])

export const shiftRequestStatusEnum = pgEnum('shift_assignment_status', ['accepted', 'pending', 'declined'])

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const company = pgTable(
	'company',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		domain: text('domain'),
		email: text('email').notNull(),
		timezone: text('timezone'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	table => [index('company_name').on(table.name), uniqueIndex('company_email').on(table.email)],
)

export const billing_info = pgTable('billing_info', {
	id: text('id').primaryKey(),
	companyId: text('companyId').references(() => company.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	secondary_email: text('secondary_email'),
	primary_phone: text('primary_phone'),
	secondary_phone: text('secondary_phone'),
	address: text('address').notNull(),
	city: text('city').notNull(),
	country: text('country').notNull(),
	account_no: text('account_no'),
	account_name: text('account_name'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const site = pgTable(
	'site',
	{
		id: text('id').primaryKey(),
		companyId: text('companyId')
			.notNull()
			.references(() => company.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		address: text('address').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('site_companyId').on(table.companyId)],
)

export const employee = pgTable(
	'company',
	{
		id: text('id').primaryKey(),
		userId: text('userId')
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		name: text('name').notNull(),
		phone: text('phone').notNull(),
		email: text('email').notNull(),
		password: text('password').notNull(),
		role: employeeRoleEnum('role').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},

	table => [
		index('employee_userId').on(table.userId),
		uniqueIndex('employee_phone_no').on(table.phone),
		uniqueIndex('employee_email').on(table.email),
	],
)

/*
 * admin ( users table ) can creates shifts either indvidually or bulk
 * @property {string} companyId - one to many realtionship with the company.
 * @property {string} siteId - one to many realtionship with the site.
 * @property {enum} status - status enum for the site.
 * */
export const shift = pgTable(
	'shift',
	{
		id: text('id').primaryKey(),
		companyId: text('companyId')
			.references(() => company.id, { onDelete: 'cascade' })
			.notNull(),
		siteId: text('siteId')
			.references(() => site.id, { onDelete: 'cascade' })
			.notNull(),
		status: shiftStatusEnum('status').notNull().default('unassigned'),
		roles_required: text('roles_required').array().notNull(),
		start_at: timestamp('start_at').notNull(),
		end_at: timestamp('end_at').notNull(),
		pay_rate: numeric('pay_rate').notNull(),
		multiplyer: numeric('multiplyer').notNull(),
		published_by: text('published_by')
			.references(() => user.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('shift_siteId').on(table.siteId), index('shift_companyId').on(table.companyId)],
)

export const shift_assignement = pgTable(
	'shift_assignement',
	{
		id: text('id').primaryKey(),
		shiftId: text('shift')
			.references(() => shift.id, { onDelete: 'cascade' })
			.notNull(),
		employeeId: text('employeeId')
			.references(() => employee.id, { onDelete: 'cascade' })
			.notNull(),
		siteId: text('siteId')
			.references(() => site.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},

	table => [
		index('shift_assignement_shiftId').on(table.shiftId),
		index('shift_assignement_siteId').on(table.siteId),
		index('shift_assignement_employeeId').on(table.employeeId),
	],
)

export const shift_assignement_request = pgTable(
	'shift_assignement_request',
	{
		id: text('id').primaryKey(),
		status: shiftRequestStatusEnum('status').notNull().default('pending'),
		employeeId: text('employeeId')
			.references(() => employee.id, { onDelete: 'cascade' })
			.notNull(),
		siteId: text('siteId')
			.references(() => site.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [
		index('shift_assignement_request_employeeId').on(table.employeeId),
		index('shift_assignement_request_siteId').on(table.siteId),
	],
)

export const audit_log = pgTable(
	'audit_log',
	{
		id: text('id').primaryKey(),
		userId: text('userId')
			.references(() => user.id)
			.notNull(),
		companyId: text('companyId')
			.references(() => company.id)
			.notNull(),
		description: text('description').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('audit_log_companyId').on(table.companyId), index('audit_log_userId').on(table.userId)],
)

/* __Relations__ */

export const companyRelations = relations(company, ({ one }) => ({
	billingInfo: one(billing_info, {
		fields: [company.id],
		references: [billing_info.companyId],
	}),
}))

export const billingInfoRelations = relations(billing_info, ({ one }) => ({
	company: one(company, {
		fields: [billing_info.companyId],
		references: [company.id],
	}),
}))
