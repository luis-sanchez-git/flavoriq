import { expect, test } from "@playwright/test"

const myTest = test.extend({
    webApp: async ({ page }, use) => {
        await page.goto("/recipes")
        await page.getByRole("textbox", { name: /password/i }).fill("password")
        await page
            .getByRole("button", { name: /sign in with password/i })
            .click()
        await page.waitForURL("/recipes")
        await expect(page.getByTestId("recipes-page-header")).toBeVisible()
        await use(page)
        page.getByTestId("dfsdfsd")
        page.getByRole("alert")
        page.getByRole("article")
    },
})

export { myTest as test }
