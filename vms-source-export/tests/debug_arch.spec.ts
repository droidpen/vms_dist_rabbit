import { test } from '@playwright/test';
import fs from 'fs';

test('check arch component', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  // Click project selector
  await page.locator('button:has-text("Active Project")').click();
  await page.waitForTimeout(500);
  
  // Select National Identity (a known project with system_type)
  await page.locator('button:has-text("National Identity")').click();
  await page.waitForTimeout(2000);
  
  // Find the Architecture section text
  const bodyText = await page.locator('body').innerText();
  console.log("--- DOM TEXT SNIPPET ---");
  const idx = bodyText.indexOf('System Architecture Analysis');
  if (idx !== -1) {
     console.log(bodyText.substring(Math.max(0, idx - 50), idx + 300));
  } else {
     console.log("Section not found in innerText");
  }
  
  // Check if the mock description is in the DOM at all
  const hasMockDesc = bodyText.includes('This project is configured as a');
  console.log("Has mock description?", hasMockDesc);
  
  // Take a screenshot
  await page.screenshot({ path: 'arch_debug.png' });
});
