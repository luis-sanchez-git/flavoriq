ALTER TABLE "recipeIngredients" ALTER COLUMN "unit" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "recipeIngredients" DROP COLUMN "customIngredientId";--> statement-breakpoint