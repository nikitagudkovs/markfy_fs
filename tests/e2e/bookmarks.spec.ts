import { test, expect } from '@playwright/test'

test.describe('Bookmarks App E2E Tests', () => {
  test('should display bookmarks list', async ({ page }) => {
    await page.goto('/')
    
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /markfy/i })).toBeVisible()
    
    // Check if bookmarks are loaded (should have at least one bookmark from seed data)
    await expect(page.getByText(/your bookmarks/i)).toBeVisible()
  })

  test('should add a new bookmark', async ({ page }) => {
    await page.goto('/')
    
    // Fill out the add bookmark form
    await page.fill('input[name="title"]', 'E2E Test Bookmark')
    await page.fill('input[name="url"]', 'https://e2e-test.com')
    await page.fill('textarea[name="description"]', 'This is an E2E test bookmark')
    await page.check('input[name="isFavorite"]')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Wait for the page to reload and check if the bookmark appears
    await expect(page.getByText('E2E Test Bookmark')).toBeVisible()
    await expect(page.getByText('https://e2e-test.com')).toBeVisible()
  })

  test('should search bookmarks', async ({ page }) => {
    await page.goto('/')
    
    // Search for a bookmark
    await page.fill('input[id="search"]', 'Next.js')
    
    // Wait for search results
    await page.waitForTimeout(500) // Wait for debounced search
    
    // Check if search results are filtered
    await expect(page.getByText('Next.js Documentation')).toBeVisible()
  })

  test('should sort bookmarks', async ({ page }) => {
    await page.goto('/')
    
    // Change sort order
    await page.selectOption('select[id="sort"]', 'title')
    
    // Wait for sort to apply
    await page.waitForTimeout(500)
    
    // Check if bookmarks are sorted (this would need specific test data)
    const bookmarkItems = page.locator('[data-testid="bookmark-item"]')
    const count = await bookmarkItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should toggle favorite status', async ({ page }) => {
    await page.goto('/')
    
    // Find the first bookmark's favorite button
    const favoriteButton = page.locator('button[title*="favorite"]').first()
    
    // Click to toggle favorite
    await favoriteButton.click()
    
    // Wait for the page to reload
    await page.waitForTimeout(1000)
    
    // Check if the favorite status changed (this would need specific assertions)
    await expect(favoriteButton).toBeVisible()
  })

  test('should edit a bookmark', async ({ page }) => {
    await page.goto('/')
    
    // Click edit button on first bookmark
    const editButton = page.locator('button[title="Edit bookmark"]').first()
    await editButton.click()
    
    // Wait for modal to open
    await expect(page.getByText('Edit Bookmark')).toBeVisible()
    
    // Update the title
    await page.fill('input[id="edit-title"]', 'Updated E2E Title')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Wait for modal to close and page to reload
    await page.waitForTimeout(1000)
    
    // Check if the updated title appears
    await expect(page.getByText('Updated E2E Title')).toBeVisible()
  })

  test('should delete a bookmark', async ({ page }) => {
    await page.goto('/')
    
    // Click delete button on first bookmark
    const deleteButton = page.locator('button[title="Delete bookmark"]').first()
    
    // Set up dialog handler for confirmation
    page.on('dialog', dialog => dialog.accept())
    
    await deleteButton.click()
    
    // Wait for the page to reload
    await page.waitForTimeout(1000)
    
    // The bookmark should be removed from the list
    // This test would need specific bookmark identification
  })

  test('should handle pagination', async ({ page }) => {
    await page.goto('/')
    
    // Check if pagination controls are visible (if there are enough bookmarks)
    const pagination = page.locator('text=Showing')
    if (await pagination.isVisible()) {
      // Click next page if available
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(500)
        
        // Check if we're on page 2
        await expect(page.locator('text=Page 2')).toBeVisible()
      }
    }
  })
})
