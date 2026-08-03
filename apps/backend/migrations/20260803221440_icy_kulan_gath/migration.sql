CREATE TYPE "type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "frequency" AS ENUM('once', 'weekly', 'biweekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "transaction_status" AS ENUM('actual', 'projected', 'skipped');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY,
	"family_id" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"type" "type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" serial PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_invites" (
	"id" serial PRIMARY KEY,
	"family_id" integer NOT NULL,
	"invited_email" varchar(100) NOT NULL,
	"invited_by_user_id" integer NOT NULL,
	"token" varchar(64) NOT NULL UNIQUE,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY,
	"family_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY,
	"family_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(12,2) NOT NULL,
	"frequency" "frequency" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"day_of_month" integer,
	"day_of_week" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY,
	"family_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"schedule_id" integer,
	"created_by_user_id" integer NOT NULL,
	"amount" numeric(12,2) NOT NULL,
	"type" "type",
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"description" varchar(255),
	"status" "transaction_status" DEFAULT 'actual'::"transaction_status" NOT NULL
);
