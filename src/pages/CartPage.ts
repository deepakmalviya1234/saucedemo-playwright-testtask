import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the cart page (`/cart.html`).
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectContainsProduct(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toHaveCount(
      1,
    );
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
