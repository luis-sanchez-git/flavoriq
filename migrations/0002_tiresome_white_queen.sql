CREATE TABLE "mealBasketRecipes" (
	"basketRecipeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"basketId" uuid NOT NULL,
	"recipeId" uuid NOT NULL,
	"plannedServings" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mealBasket" (
	"basketId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mealBasketRecipes" ADD CONSTRAINT "mealBasketRecipes_basketId_mealBasket_basketId_fk" FOREIGN KEY ("basketId") REFERENCES "public"."mealBasket"("basketId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mealBasketRecipes" ADD CONSTRAINT "mealBasketRecipes_recipeId_recipeTable_recipeId_fk" FOREIGN KEY ("recipeId") REFERENCES "public"."recipeTable"("recipeId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mealBasket" ADD CONSTRAINT "mealBasket_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;