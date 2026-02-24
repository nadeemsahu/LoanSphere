const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

        await page.screenshot({ path: 'test_home.png', fullPage: true });

        const html = await page.content();
        console.log("HTML length:", html.length);
        console.log("Found homepage-container:", html.includes('homepage-container'));

        await browser.close();
    } catch (e) {
        console.log("PUPPETEER ERROR:", e.message);
    }
})();
