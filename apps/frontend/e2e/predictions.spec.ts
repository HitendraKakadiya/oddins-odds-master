// import { test, expect } from '@playwright/test';

// test.describe('Predictions Page', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/predictions');
//   });

//   test('predictions page loads', async ({ page }) => {
//     await expect(page.locator('h1')).toContainText(/prediction/i);
//   });

//   test('filter controls are visible', async ({ page }) => {
//     // Date filter should exist
//     const dateInput = page.locator('input[type="date"]');
//     await expect(dateInput).toBeVisible();

//     // Search button should exist
//     const searchButton = page.locator('button').filter({ hasText: /search/i });
//     await expect(searchButton).toBeVisible();
//   });

//   test('can interact with date filter', async ({ page }) => {
//     const dateInput = page.locator('input[type="date"]');

//     // Set a date and click search
//     const today = new Date().toISOString().split('T')[0];
//     await dateInput.fill(today);

//     const searchButton = page.locator('button').filter({ hasText: /search/i });
//     await searchButton.click();

//     // Page should still show predictions (content may reload)
//     await expect(page.locator('h1')).toContainText(/prediction/i);
//   });
// });
