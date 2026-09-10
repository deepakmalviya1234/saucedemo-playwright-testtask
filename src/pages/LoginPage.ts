import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page (`/`).
 *
 * Locator strategy: the username/password inputs on SauceDemo have no
 * associated <label>, so a pure role/label locator is not reliable. We use the
 * stable `data-test` attributes the app ships specifically for automation,
 * which are more robust than CSS class selectors. The Login button is exposed
 * as a role="button", so we use `getByRole` there.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // The error banner is exposed via data-test="error"; no better role hook exists.
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }
}
