import { chromium } from 'playwright';
import path from 'path';

(async () => {
    console.log('Starting Playwright E2E Testing...');
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // --- Helper for Login ---
    async function loginAs(email, roleName) {
        console.log(`\n--- Logging in as ${roleName} ---`);
        await page.goto('http://localhost:5173/login');
        await page.waitForSelector('input[type="email"]');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        // Wait for dashboard to load
        await page.waitForSelector('.dashboard-layout');
        await page.waitForTimeout(1000); // animations
    }

    // --- Helper for Logout ---
    async function logout() {
        console.log(`Logging out...`);
        await page.click('.profile-btn');
        await page.waitForSelector('.profile-menu');
        await page.click('button:has-text("Logout")');
        await page.waitForURL('http://localhost:5173/login');
    }

    try {
        // 1. ADMIN TEST
        await loginAs('admin@loansphere.com', 'Admin');
        await page.screenshot({ path: 'test-admin-dashboard.png', fullPage: true });
        console.log('Saved Admin Dashboard screenshot.');
        await logout();

        // 2. LENDER TEST
        await loginAs('lender@loansphere.com', 'Lender');
        await page.screenshot({ path: 'test-lender-dashboard.png', fullPage: true });
        console.log('Saved Lender Dashboard screenshot.');

        console.log('Navigating to Create Loan...');
        await page.click('a[href="/lender/create-loan"]');
        await page.waitForSelector('form');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-lender-create-loan.png', fullPage: true });
        console.log('Saved Lender Create Loan screenshot.');
        await logout();

        // 3. BORROWER TEST
        await loginAs('borrower@loansphere.com', 'Borrower');
        await page.screenshot({ path: 'test-borrower-dashboard.png', fullPage: true });
        console.log('Saved Borrower Dashboard screenshot.');
        await logout();

        console.log('\nAll tests completed successfully!');

    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await browser.close();
    }
})();
