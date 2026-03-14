import { test, expect } from '@playwright/test';

test.describe('Leagues Page', () => {
  // test('leagues page loads with content', async ({ page }) => {
  //   await page.goto('/leagues');

  //   await expect(page.locator('h1')).toContainText(/league/i);

  //   // Wait for leagues to load (either cards or loading state)
  //   await page.waitForSelector('[class*="league"], [class*="loading"], .animate-pulse', {
  //     timeout: 10000,
  //   }).catch(() => {
  //     // It's okay if no leagues are found in test environment
  //   });
  // });

  // test('search functionality exists', async ({ page }) => {
  //   await page.goto('/leagues');

  //   // Page should have some search/filter input or main content area
  //   const hasSearchInput = await page.locator('input[type="text"], input[type="search"], input[placeholder*="earch" i], [role="searchbox"]').first().isVisible().catch(() => false);
  //   const hasMainContent = await page.locator('main, [class*="league"], [class*="content"]').first().isVisible().catch(() => false);
  //   expect(hasSearchInput || hasMainContent).toBeTruthy();
  // });
});
