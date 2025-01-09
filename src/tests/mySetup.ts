import { expect, test, Page } from '@playwright/test'

interface WebAppFixture {
    webApp: Page
}

const myTest = test.extend<WebAppFixture>({
    webApp: async ({ page }, callback) => {
        await page.goto('/recipes')
        await page.getByRole('textbox', { name: /password/i }).fill('password')
        await page
            .getByRole('button', { name: /sign in with password/i })
            .click()
        await page.waitForURL('/recipes')
        await expect(page.getByTestId('recipes-page-header')).toBeVisible()
        await callback(page)
    },
})

export { myTest as test }
