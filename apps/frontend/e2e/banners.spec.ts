// import { test, expect } from '@playwright/test';

// /**
//  * Banner UI E2E: Ad banners are rendered by the layout (top/bottom) and point to valid URLs.
//  * Uses production API (NEXT_PUBLIC_API_URL in CI / .env.local locally).
//  */
// test.describe('Banner UI', () => {
//   test('banner is visible and has valid link URL', async ({ page }) => {
//     await page.goto('/');

//     // Banner loads async; wait for either a banner link (anchor with img) or loading placeholder
//     const bannerLink = page.locator('a[href^="http"]').filter({ has: page.locator('img') }).first();
//     await expect(bannerLink).toBeVisible({ timeout: 15000 });

//     const href = await bannerLink.getAttribute('href');
//     expect(href).toBeTruthy();
//     expect(href).toMatch(/^https?:\/\//);
//     expect(new URL(href!)).toBeDefined(); // throws if invalid
//   });

//   test('banner image has valid URL', async ({ page }) => {
//     await page.goto('/');

//     // Banner image is inside the banner link
//     const bannerImg = page.locator('a[href^="http"] img[src^="http"]').first();
//     await expect(bannerImg).toBeVisible({ timeout: 15000 });

//     const src = await bannerImg.getAttribute('src');
//     expect(src).toBeTruthy();
//     expect(src).toMatch(/^https?:\/\//);
//     expect(new URL(src!)).toBeDefined();
//   });
// });
