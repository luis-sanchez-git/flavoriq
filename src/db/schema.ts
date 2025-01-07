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
    pgEnum,
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
    },
    (table) => {
        return {
            idIdx: uniqueIndex('idIdx').on(table.id),
        }
    },
)

export const recipeIngredients = pgTable('recipeIngredients', {
    id: uuid('ingredientId').primaryKey().defaultRandom(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('ingredientName', { length: 255 }).notNull(),
    quantity: real('ingredientQuantity').$type<number>(),
    unit: varchar('unit', { length: 255 }),
    note: text('ingredientNote'), // For additional context like "favorite rub seasoning" or unknown units
})

export const steps = pgTable('stepsTable', {
    id: uuid('stepId').primaryKey().defaultRandom(),

    recipeId: uuid('recipeId')
        .references(() => recipes.id)
        .notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    stepNumber: integer('stepNumber').notNull(),
    description: text('stepContent').notNull(),
})
