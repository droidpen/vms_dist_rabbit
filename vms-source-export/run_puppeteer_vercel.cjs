const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to Vercel VMS...');
  await page.goto('https://vms-main-portal.vercel.app/', { waitUntil: 'networkidle' });
  
  const rootHtml = await page.locator('#root').innerHTML();
  console.log('Root HTML length:', rootHtml.length);
  if (rootHtml.length < 50) {
      console.log('App failed to mount on Vercel.');
  } else {
      console.log('App mounted successfully on Vercel.');
  }

  await browser.close();
})();
