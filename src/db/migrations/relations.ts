import { relations } from "drizzle-orm/relations";
import { user, account, session, company, auditLog, billingInfo, shift, site, shiftAssignement, shiftAssignementRequest } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	auditLogs: many(auditLog),
	companies: many(company),
	shifts: many(shift),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	company: one(company, {
		fields: [auditLog.companyId],
		references: [company.id]
	}),
	user: one(user, {
		fields: [auditLog.userId],
		references: [user.id]
	}),
}));

export const companyRelations = relations(company, ({one, many}) => ({
	auditLogs: many(auditLog),
	user: one(user, {
		fields: [company.userId],
		references: [user.id]
	}),
	billingInfos: many(billingInfo),
	shifts: many(shift),
	shiftAssignements: many(shiftAssignement),
	shiftAssignementRequests: many(shiftAssignementRequest),
	sites: many(site),
}));

export const billingInfoRelations = relations(billingInfo, ({one}) => ({
	company: one(company, {
		fields: [billingInfo.companyId],
		references: [company.id]
	}),
}));

export const shiftRelations = relations(shift, ({one, many}) => ({
	company: one(company, {
		fields: [shift.companyId],
		references: [company.id]
	}),
	user: one(user, {
		fields: [shift.publishedBy],
		references: [user.id]
	}),
	site: one(site, {
		fields: [shift.siteId],
		references: [site.id]
	}),
	shiftAssignements: many(shiftAssignement),
}));

export const siteRelations = relations(site, ({one, many}) => ({
	shifts: many(shift),
	shiftAssignements: many(shiftAssignement),
	shiftAssignementRequests: many(shiftAssignementRequest),
	company: one(company, {
		fields: [site.companyId],
		references: [company.id]
	}),
}));

export const shiftAssignementRelations = relations(shiftAssignement, ({one}) => ({
	company: one(company, {
		fields: [shiftAssignement.employeeId],
		references: [company.id]
	}),
	shift: one(shift, {
		fields: [shiftAssignement.shift],
		references: [shift.id]
	}),
	site: one(site, {
		fields: [shiftAssignement.siteId],
		references: [site.id]
	}),
}));

export const shiftAssignementRequestRelations = relations(shiftAssignementRequest, ({one}) => ({
	company: one(company, {
		fields: [shiftAssignementRequest.employeeId],
		references: [company.id]
	}),
	site: one(site, {
		fields: [shiftAssignementRequest.siteId],
		references: [site.id]
	}),
}));