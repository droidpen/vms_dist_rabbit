const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to DevSecOps...');
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Give mermaid time to render
  
  const hasSyntaxError = await page.evaluate(() => {
     return document.body.innerText.includes('Syntax error');
  });
  
  console.log('Syntax Error Visible:', hasSyntaxError);

  await browser.close();
})();
