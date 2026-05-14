const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Click project selector
  await page.locator('button:has-text("Active Project")').click();
  await page.waitForTimeout(500);
  
  // Select National Identity
  await page.locator('button:has-text("National Identity")').click();
  await page.waitForTimeout(2000);
  
  const bodyText = await page.locator('body').innerText();
  console.log("--- DOM TEXT SNIPPET ---");
  const idx = bodyText.indexOf('System Architecture Analysis');
  if (idx !== -1) {
     console.log(bodyText.substring(Math.max(0, idx - 50), idx + 300));
  } else {
     console.log("Section not found in innerText");
  }
  
  const hasMockDesc = bodyText.includes('This project is configured as a');
  console.log("Has mock description?", hasMockDesc);

  await browser.close();
})();
