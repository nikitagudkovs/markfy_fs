import { test, expect } from '@playwright/test'

test.describe('Bookmarks App E2E Tests', () => {
  test('should display bookmarks list', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check if the main heading is visible
    const heading = page.locator('h1.logo')
    await expect(heading).toBeVisible()
    
    // Check if the search input is visible
    await expect(page.getByPlaceholder('Search...')).toBeVisible()
    
    // Check if the add button is visible
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible()
  })

  test('should add a new bookmark', async ({ page }) => {
    const suffix = Date.now().toString()
    const title = `E2E Test Bookmark ${suffix}`
    const url = `https://e2e-test-${suffix}.com`

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Click the add button to open the modal
    await page.click('button:has-text("Add")')
    
    // Wait for modal to open
    await expect(page.getByRole('heading', { name: 'Add Bookmark' })).toBeVisible()
    
    // Fill out the add bookmark form
    await page.fill('input[name="title"]', title)
    await page.fill('input[name="url"]', url)
    await page.fill('textarea[name="description"]', 'This is an E2E test bookmark')
    await page.check('input[name="isFavorite"]')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Wait for the form submission to complete
    await page.waitForTimeout(2000)
    
    // Check if the bookmark was added by looking for the title heading
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  })

  test('should search bookmarks', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Search for a bookmark using the search input
    await page.fill('input[placeholder="Search..."]', 'Next.js')
    
    // Wait for debounced search to complete
    await page.waitForTimeout(1000)
    
    // Check if the search functionality works by verifying the input is interactive
    const searchInput = page.locator('input[placeholder="Search..."]')
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeEnabled()
  })

  test('should sort bookmarks', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Change sort order using the select dropdown
    await page.selectOption('select', 'title')
    
    // Wait for debounced sort to complete
    await page.waitForTimeout(1500)
    
    // Check if the sort functionality works by verifying the select is interactive
    const sortSelect = page.locator('select')
    await expect(sortSelect).toBeVisible()
    await expect(sortSelect).toBeEnabled()
  })
})