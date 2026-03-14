// import { test, expect } from '@playwright/test';

// test.describe('Smoke Tests', () => {
//   test('homepage loads successfully', async ({ page }) => {
//     await page.goto('/');

//     await expect(page).toHaveTitle(/Oddins/i);
//     await expect(page.locator('header')).toBeVisible();
//   });

//   test('navigation works', async ({ page }) => {
//     await page.goto('/');

//     // Check main navigation links exist
//     await expect(page.locator('header')).toBeVisible();

//     // Navigate to predictions page
//     const predictionsLink = page.locator('a[href*="/predictions"]').first();
//     if (await predictionsLink.isVisible()) {
//       await predictionsLink.click();
//       await expect(page).toHaveURL(/predictions/);
//     }
//   });

//   test('health endpoint returns healthy', async ({ request }) => {
//     const response = await request.get('/health');
//     expect(response.ok()).toBeTruthy();

//     const body = await response.json();
//     expect(body.status).toBe('healthy');
//   });
// });
