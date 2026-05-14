import { test, expect } from '@playwright/test';

test('Compare rendering of port 5173 and 5174', async ({ page }) => {
  // Check Port 5173
  await page.goto('http://localhost:5173');
  const title5173 = await page.title();
  const content5173 = await page.textContent('body');
  
  // Check Port 5174
  await page.goto('http://localhost:5174');
  const title5174 = await page.title();
  const content5174 = await page.textContent('body');

  console.log('5173 Title:', title5173);
  console.log('5174 Title:', title5174);
  
  expect(title5173).not.toBe(title5174);
});
