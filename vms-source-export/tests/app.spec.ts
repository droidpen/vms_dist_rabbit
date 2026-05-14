import { test, expect } from '@playwright/test';

test('app should render and show title', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Adjust this based on actual app title/element
  await expect(page).toHaveTitle(/Vulnerability Management Interface/);
});
