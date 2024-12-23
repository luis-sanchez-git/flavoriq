ALTER TABLE "ingredientsTable" ALTER COLUMN "ingredientQuantity" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "ingredientsTable" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredientsTable" ADD CONSTRAINT "ingredientsTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;