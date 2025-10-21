import { test, expect } from '@playwright/test'

test.describe('Basic App Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if we can find any text on the page
    const bodyText = await page.textContent('body')
    console.log('Page content:', bodyText)
    
    // Just check that the page loaded (not empty)
    expect(bodyText).toBeTruthy()
    expect(bodyText?.length).toBeGreaterThan(0)
  })
})
