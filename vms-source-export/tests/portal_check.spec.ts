import { test, expect } from '@playwright/test';

test('DevSecOps Portal is reachable and renders headers', async ({ page }) => {
  // 1. Check Main App
  console.log('Checking Main App (5173)...');
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/Vulnerability Management Interface/i);
  console.log('✅ Main App Title verified.');

  // 2. Check DevSecOps Portal
  console.log('Checking DevSecOps Portal (5174)...');
  const response = await page.goto('http://localhost:5174');
  expect(response?.status()).toBe(200);
  
  // Look for any header text
  console.log('Waiting for Dashboard content...');
  await page.waitForSelector('h1', { timeout: 10000 });
  const h1Text = await page.textContent('h1');
  console.log(`Received H1 Text: "${h1Text}"`);
  
  await expect(page.locator('h1')).toContainText('DevSecOps');
  console.log('✅ DevSecOps Portal Header verified.');

  // 3. Verify the Pillars are rendered
  await expect(page.locator('text=Development')).toBeVisible();
  await expect(page.locator('text=Operations')).toBeVisible();
  console.log('✅ Pillars (DEV/OPS) are visible.');
});
