ALTER TABLE "customIngredients" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "customIngredients" CASCADE;--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "recipeIngredients" ALTER COLUMN "unit" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipeIngredients" DROP COLUMN "recipeId";--> statement-breakpoint
ALTER TABLE "recipeIngredients" DROP COLUMN "predefinedIngredient";--> statement-breakpoint
ALTER TABLE "recipeIngredients" DROP COLUMN "customIngredientId";--> statement-breakpoint
DROP TYPE "public"."knownIngredients";--> statement-breakpoint
DROP TYPE "public"."knownUnits";