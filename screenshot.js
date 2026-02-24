import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1536, height: 900 } });

    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/login');

    console.log('Logging in...');
    await page.fill('input[type="email"]', 'admin@loansphere.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    console.log('Waiting for admin dashboard...');
    await page.waitForURL('http://localhost:5173/admin');
    await page.waitForSelector('.dashboard-layout');

    // add small delay for animations
    await page.waitForTimeout(1000);

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'playwright-screenshot.png', fullPage: true });

    await browser.close();
    console.log('Done!');
})();
