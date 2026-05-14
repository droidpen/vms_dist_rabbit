import { test } from '@playwright/test';

test('capture console errors', async ({ page }) => {
  const errors: string[] = [];
  
  page.on('pageerror', error => {
    console.log('\n[FATAL PAGE ERROR]', error.message);
    console.log(error.stack);
    errors.push(error.message);
  });
  
  page.on('console', msg => { 
    if (msg.type() === 'error') {
      console.log('\n[CONSOLE ERROR]', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/');
  
  console.log('Waiting for React to mount (or crash)...');
  await page.waitForTimeout(3000);
  
  if (errors.length === 0) {
    console.log('No console errors detected. Checking DOM for blank screen...');
    const content = await page.content();
    if (content.includes('id="root"')) {
        const rootHtml = await page.locator('#root').innerHTML();
        console.log('Root div length:', rootHtml.length);
        if (rootHtml.length < 50) {
            console.log('Root div is essentially empty. React failed to mount without throwing a global error.');
        } else {
            console.log('React appears to have mounted successfully.');
        }
    }
  }
});
