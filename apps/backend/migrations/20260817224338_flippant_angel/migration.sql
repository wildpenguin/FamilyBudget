ALTER TABLE "schedules" ADD COLUMN "amount_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "amount_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET NOT NULL;