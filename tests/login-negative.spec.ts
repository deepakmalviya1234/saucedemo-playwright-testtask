import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { INVALID_LOGIN_CASES, USERS, PASSWORD } from '../src/data/users';

/**
 * Negative auth + data-driven scenario.
 *
 * These tests must start from a clean, unauthenticated context, so we override
 * `storageState` to `undefined` here rather than inheriting the authenticated
 * state used by the rest of the suite.
 */
const test = base.extend({
  storageState: async ({}, use) => {
    await use(undefined);
  },
});

test.describe('Login — negative and data-driven', () => {
  test.describe('data-driven invalid credentials', () => {
    for (const testCase of INVALID_LOGIN_CASES) {
      test(`shows an error for ${testCase.description}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(testCase.username, testCase.password);
        await loginPage.expectError(testCase.expectedError);
        await expect(page).toHaveURL('https://www.saucedemo.com/');
      });
    }
  });

  test('locked out user cannot reach inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.lockedOut, PASSWORD);
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });
});
