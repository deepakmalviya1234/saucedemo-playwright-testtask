import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { USERS, PASSWORD } from '../src/data/users';

const authFile = 'playwright/.auth/user.json';

/**
 * Runs once (as the `setup` project). Logs in through the UI a single time and
 * persists the authenticated session to disk. All other tests reuse this state
 * via `storageState`, so no test performs a repeated UI login.
 */
setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard, PASSWORD);

  // Confirm we actually reached the inventory before saving state.
  await expect(page).toHaveURL(/.*inventory\.html/);

  await page.context().storageState({ path: authFile });
});
