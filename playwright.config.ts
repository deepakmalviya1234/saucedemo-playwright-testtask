import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * Design notes:
 * - `retries` and single-worker execution are enabled only on CI (`process.env.CI`),
 *   keeping local runs fast and deterministic while making CI resilient to flakes.
 * - `trace` and `screenshot` are captured only on failure to keep artifacts small.
 * - The `setup` project generates the authenticated storage state once; the main
 *   project depends on it so individual tests never log in through the UI.
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reuse the authenticated session produced by the setup project.
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
