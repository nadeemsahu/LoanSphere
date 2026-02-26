import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Ensure screenshots directory exists
const SCREENSHOT_DIR = 'login-ui-screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('Login UI Enhancements Visual Test', () => {
    test('Capture Login Page UI states', async ({ page }) => {
        // Navigate to the dev server
        await page.goto('http://localhost:5173/login');

        // Wait for the main card to be visible
        await expect(page.locator('.auth-card')).toBeVisible();

        // Give it a tiny bit of time for fonts to render and animations to settle
        await page.waitForTimeout(1500);

        // 1. Capture Light Mode
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, '01-light-mode.png'),
            fullPage: true
        });

        // 2. Toggle Dark Mode
        const themeToggle = page.locator('.auth-theme-toggle');
        await themeToggle.click();

        // Wait for the transition to complete
        await page.waitForTimeout(1000);

        // Capture Dark Mode
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, '02-dark-mode.png'),
            fullPage: true
        });

        // 3. Fill the form to see input focus states and filled styling
        await page.locator('input[type="email"]').fill('test@loansphere.com');
        await page.locator('input[type="password"]').fill('test123');

        // Leave focus on the password field to capture the focus ring glow
        await page.locator('input[type="password"]').focus();

        // Capture Filled Form in Dark Mode
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, '03-form-filled-focused.png'),
            fullPage: true
        });

        // 4. Hover the Sign In button
        const signInBtn = page.locator('button[type="submit"]');
        await signInBtn.hover();

        // Wait for hover animation
        await page.waitForTimeout(500);

        // Capture Button Hover State
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, '04-button-hover.png')
        });

        // 5. Switch back to light mode and fill form
        await themeToggle.click();
        await page.waitForTimeout(1000);
        await signInBtn.hover();
        await page.waitForTimeout(500);

        // Capture Light Mode Button Hover
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, '05-light-mode-button-hover.png')
        });

        console.log('✅ Screenshots saved to: ' + SCREENSHOT_DIR);
    });
});
