import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    let errors = 0;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error' && !text.includes('Fast Refresh')) {
            console.error(`Browser Error: ${text}`);
            errors++;
        }
    });

    page.on('pageerror', err => {
        console.error(`Page Error: ${err.message}`);
        errors++;
    });

    const roles = [
        { email: 'admin@loansphere.com', paths: ['/admin', '/admin/users', '/admin/loans', '/admin/transactions', '/admin/stats'] },
        { email: 'lender@loansphere.com', paths: ['/lender', '/lender/create-loan', '/lender/offers', '/lender/borrowers', '/lender/payments'] },
        { email: 'borrower@loansphere.com', paths: ['/borrower', '/borrower/offers', '/borrower/apply', '/borrower/loans', '/borrower/payments'] },
        { email: 'analyst@loansphere.com', paths: ['/analyst', '/analyst/analytics', '/analyst/risk', '/analyst/transactions'] }
    ];

    for (const role of roles) {
        console.log(`\nTesting Role: ${role.email}`);
        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]');
        await page.fill('input[type="email"]', role.email);
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForSelector('.dashboard-layout');

        for (const p of role.paths) {
            console.log(`  Visiting ${p}...`);
            await page.goto(`http://localhost:5173${p}`);
            await page.waitForSelector('.page-title');
            await page.waitForTimeout(500); // wait for mounts
        }

        // Logout
        await page.click('.profile-btn');
        await page.waitForSelector('.profile-menu');
        await page.click('button:has-text("Logout")');
        await page.waitForURL('http://localhost:5173/login');
    }

    await browser.close();

    if (errors === 0) {
        console.log('\nSUCCESS: Full pass completed with NO console/runtime errors across all routes.');
        process.exit(0);
    } else {
        console.error(`\nFAILURE: Found ${errors} errors during the pass.`);
        process.exit(1);
    }
})();
