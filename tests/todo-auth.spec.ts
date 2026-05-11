import { expect, test, type Page } from '@playwright/test'

const login = async (page: Page) => {
  await page.goto('/login')
  await page.getByTestId('username-input').fill('demo')
  await page.getByTestId('password-input').fill('password123')
  await page.getByTestId('login-button').click()
  await expect(page).toHaveURL('/todos')
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
})

test('redirects unauthenticated users away from protected todo page', async ({ page }) => {
  await page.goto('/todos')

  await expect(page).toHaveURL('/login')
  await expect(page.getByTestId('login-screen')).toBeVisible()
})

test('allows login with valid credentials', async ({ page }) => {
  await login(page)
  await expect(page.getByTestId('todo-screen')).toBeVisible()
})

test('adds, toggles, and deletes a todo item', async ({ page }) => {
  await login(page)

  await page.getByTestId('new-todo-input').fill('Buy milk')
  await page.getByTestId('add-todo-button').click()

  const todoItem = page.getByTestId('todo-item-1')
  await expect(todoItem).toContainText('Buy milk')

  await page.getByTestId('toggle-todo-1').check()
  await expect(page.getByTestId('toggle-todo-1')).toBeChecked()

  await page.getByTestId('delete-todo-1').click()
  await expect(todoItem).toHaveCount(0)
})

test('logs out and redirects to login', async ({ page }) => {
  await login(page)

  await page.getByTestId('logout-button').click()

  await expect(page).toHaveURL('/login')
  await expect(page.getByTestId('login-button')).toBeVisible()
})
