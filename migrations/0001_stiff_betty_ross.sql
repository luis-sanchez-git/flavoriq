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
	"userId" uuid NOT NULL,
	"servings" integer NOT NULL,
	"duration" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stepsTable" (
	"stepId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"stepNumber" integer NOT NULL,
	"stepContent" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
DROP TABLE "todo" CASCADE;--> statement-breakpoint
ALTER TABLE "ingredientsTable" ADD CONSTRAINT "ingredientsTable_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeTable" ADD CONSTRAINT "recipeTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stepsTable" ADD CONSTRAINT "stepsTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;