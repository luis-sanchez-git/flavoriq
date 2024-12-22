CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredientsTable" (
	"ingredientId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipeId" uuid NOT NULL,
	"ingredientName" varchar(255) NOT NULL,
	"ingredientQuantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipeTable" (
	"recipeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"userId" text NOT NULL,
	"servings" integer NOT NULL,
	"duration" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stepsTable" (
	"stepId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"stepNumber" integer NOT NULL,
	"stepContent" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredientsTable" ADD CONSTRAINT "ingredientsTable_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeTable" ADD CONSTRAINT "recipeTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stepsTable" ADD CONSTRAINT "stepsTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;