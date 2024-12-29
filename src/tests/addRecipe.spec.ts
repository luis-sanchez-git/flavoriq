import { expect, Page } from '@playwright/test'
import { test } from './mySetup'

test('should add recipe', async ({ webApp }) => {
    await webApp.getByRole('button', { name: /add recipe/i }).click()
    await webApp.getByRole('textbox').fill('a new recipe')
    await webApp.getByRole('button', { name: /create/i }).click()
    await expect(webApp.getByText('success')).toBeVisible()
})
