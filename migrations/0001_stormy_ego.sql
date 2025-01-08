ALTER TABLE "stepsTable" DROP CONSTRAINT "stepsTable_recipeId_recipeTable_recipeId_fk";
--> statement-breakpoint
ALTER TABLE "stepsTable" ADD CONSTRAINT "stepsTable_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE cascade ON UPDATE no action;