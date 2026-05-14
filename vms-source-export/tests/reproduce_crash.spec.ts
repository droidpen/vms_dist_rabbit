import { test } from '@playwright/test';

test('reproduce blank screen', async ({ page }) => {
  const errors: string[] = [];
  
  // Listen for unhandled exceptions and console errors
  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
    console.log('[STACK]', error.stack);
    errors.push(error.message);
  });
  page.on('console', msg => { 
    if (msg.type() === 'error') {
      console.log('[CONSOLE ERROR]', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('Navigating to portal...');
  await page.goto('http://localhost:5173/');
  
  console.log('Opening project dropdown...');
  await page.locator('button:has-text("Active Project")').click();
  
  console.log('Selecting project...');
  // Find any project in the list that isn't the active one
  await page.locator('button:has(svg.lucide-layout-grid)').first().click();

  console.log('Waiting for crash to occur...');
  await page.waitForTimeout(3000);
  
  console.log('Total errors caught:', errors.length);
});
