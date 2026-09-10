import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the inventory (products) page (`/inventory.html`).
 */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products', { exact: true });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.title).toBeVisible();
  }

  /**
   * Add a product to the cart by its visible name. We scope to the enclosing
   * `.inventory_item` so the "Add to cart" button is unambiguous per product.
   */
  private itemContainer(productName: string): Locator {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.itemContainer(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.itemContainer(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
