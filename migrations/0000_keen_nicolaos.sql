
--> statement-breakpoint
CREATE TABLE "recipeIngredients" (
	"ingredientId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipeId" uuid NOT NULL,
	"userId" text NOT NULL,
	"ingredientName" varchar(255) NOT NULL,
	"ingredientQuantity" real,
	"unit" varchar(255),
	"ingredientNote" text
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
	"recipeId" uuid NOT NULL,
	"userId" text NOT NULL,
	"stepNumber" integer NOT NULL,
	"stepContent" text NOT NULL
);
--> statement-breakpoint

--> statement-breakpoint
ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeTable" ADD CONSTRAINT "recipeTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stepsTable" ADD CONSTRAINT "stepsTable_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stepsTable" ADD CONSTRAINT "stepsTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idIdx" ON "recipeTable" USING btree ("recipeId");