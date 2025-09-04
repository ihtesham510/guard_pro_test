CREATE TABLE "posts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
