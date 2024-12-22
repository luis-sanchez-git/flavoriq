ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "expires_at" integer;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "token_type" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "session_state" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "emailVerified" timestamp;