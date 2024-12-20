import { pgTable, integer, text, uuid, varchar } from "drizzle-orm/pg-core"

export const UserTable = pgTable("userTable", {
    id: uuid("userId").primaryKey().defaultRandom().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
})

export const RecipeTable = pgTable("recipeTable", {
    id: uuid("recipeId").primaryKey().defaultRandom().notNull(),
    name: varchar("name").notNull(),
    userId: uuid("userId")
        .references(() => UserTable.id)
        .notNull(),
    serving: integer("servings").notNull(),
    duration: varchar("duration", { length: 100 }).notNull(),
})

export const IngredientsTable = pgTable("ingredientsTable", {
    id: uuid("ingredientId").primaryKey().defaultRandom(),
    recipeId: uuid("recipeId")
        .references(() => RecipeTable.id)
        .notNull(),
    name: varchar("ingredientName", { length: 255 }).notNull(),
    quantity: integer("ingredientQuantity").notNull(),
})

export const StepsTable = pgTable("stepsTable", {
    id: uuid("stepId").primaryKey().defaultRandom().notNull(),
    userId: uuid("userId")
        .references(() => UserTable.id)
        .notNull(),
    stepNumber: integer("stepNumber").notNull(),
    description: text("stepContent").notNull(),
})
