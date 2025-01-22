import { IngredientCategory, RecipeStatus } from '@/schemas/recipeSchema'
import {
    pgTable,
    integer,
    text,
    uuid,
    varchar,
    timestamp,
    primaryKey,
    uniqueIndex,
    real,
} from 'drizzle-orm/pg-core'

import type { AdapterAccountType } from 'next-auth/adapters'

export const users = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
})

export const accounts = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
)

export const recipes = pgTable(
    'recipeTable',
    {
        id: uuid('recipeId').primaryKey().defaultRandom(),
        name: varchar('name').notNull(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        serving: integer('servings').notNull(),
        duration: varchar('duration', { length: 100 }).notNull(),
        status: text('status')
            .$type<RecipeStatus>()
            .notNull()
            .default('PROCESSING'),
    },
    (table) => {
        return {
            idIdx: uniqueIndex('idIdx').on(table.id),
        }
    },
)

export const recipeIngredients = pgTable('recipe_ingredients', {
    id: uuid('ingredientId').primaryKey().defaultRandom(),
    recipeId: uuid('recipeId')
        .references(() => recipes.id, { onDelete: 'cascade' })
        .notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('ingredientName', { length: 255 }).notNull(),
    quantity: real('ingredientQuantity').$type<number>(),
    unit: varchar('unit', { length: 255 }),
    note: text('ingredientNote'), // For additional context like "favorite rub seasoning" or unknown units
    category: text('category')
        .$type<IngredientCategory>()
        .notNull()
        .default('Other'),
})

export const steps = pgTable('stepsTable', {
    id: uuid('stepId').primaryKey().defaultRandom(),

    recipeId: uuid('recipeId')
        .references(() => recipes.id, { onDelete: 'cascade' })
        .notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    stepNumber: integer('stepNumber').notNull(),
    description: text('stepContent').notNull(),
})

export const mealBaskets = pgTable('mealBasket', {
    id: uuid('basketId').primaryKey().defaultRandom(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
})

export const mealBasketRecipes = pgTable('mealBasketRecipes', {
    id: uuid('basketRecipeId').primaryKey().defaultRandom(),
    mealBasketId: uuid('basketId')
        .references(() => mealBaskets.id, { onDelete: 'cascade' })
        .notNull(),
    recipeId: uuid('recipeId')
        .references(() => recipes.id, { onDelete: 'cascade' })
        .notNull(),
    plannedServings: integer('plannedServings').notNull(),
})
