CREATE TYPE "public"."employee_role" AS ENUM('employee', 'supervisor');--> statement-breakpoint
CREATE TYPE "public"."shift_assignment_status" AS ENUM('accepted', 'pending', 'declined');--> statement-breakpoint
CREATE TYPE "public"."shift_status" AS ENUM('scheduled', 'ongoing', 'completed', 'assigned', 'missed', 'cancelled', 'not_attended', 'partially_filled', 'unassigned', 'holiday');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"companyId" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_info" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text,
	"email" text NOT NULL,
	"secondary_email" text,
	"primary_phone" text,
	"secondary_phone" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"account_no" text,
	"account_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "employee_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"siteId" text NOT NULL,
	"status" "shift_status" DEFAULT 'unassigned' NOT NULL,
	"roles_required" text[] NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"pay_rate" numeric NOT NULL,
	"multiplyer" numeric NOT NULL,
	"published_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_assignement" (
	"id" text PRIMARY KEY NOT NULL,
	"shift" text NOT NULL,
	"employeeId" text NOT NULL,
	"siteId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_assignement_request" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "shift_assignment_status" DEFAULT 'pending' NOT NULL,
	"employeeId" text NOT NULL,
	"siteId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_info" ADD CONSTRAINT "billing_info_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_siteId_site_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_published_by_user_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignement" ADD CONSTRAINT "shift_assignement_shift_shift_id_fk" FOREIGN KEY ("shift") REFERENCES "public"."shift"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignement" ADD CONSTRAINT "shift_assignement_employeeId_company_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignement" ADD CONSTRAINT "shift_assignement_siteId_site_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignement_request" ADD CONSTRAINT "shift_assignement_request_employeeId_company_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignement_request" ADD CONSTRAINT "shift_assignement_request_siteId_site_id_fk" FOREIGN KEY ("siteId") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;