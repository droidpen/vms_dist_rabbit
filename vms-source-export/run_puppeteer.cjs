const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.message);
  });

  console.log('Navigating to VMS...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  const rootHtml = await page.locator('#root').innerHTML();
  console.log('Root HTML length:', rootHtml.length);
  if (rootHtml.length < 50) {
      console.log('App failed to mount (blank screen).');
  } else {
      console.log('App mounted successfully.');
  }

  await browser.close();
})();
