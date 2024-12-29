import { test } from './mySetup'
import { expect } from '@playwright/test'

test.describe('Not Authenticated', () => {
    test('Should redirect to /recipes, not allow access with invalid credentials', async ({
        page,
    }) => {
        await page.goto('/recipes')
        await page
            .getByRole('textbox', { name: /password/i })
            .fill('invalidpass')
        await page
            .getByRole('button', { name: /sign in with password/i })
            .click()
        await expect(page.getByText(/sign in failed/i)).toBeVisible()
    })
})
