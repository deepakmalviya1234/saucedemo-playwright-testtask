import { test, expect } from '../src/fixtures/test-options';

/**
 * UI state after reload / storage manipulation.
 *
 * SauceDemo persists the cart in localStorage under `cart-contents`. This test
 * verifies two things:
 *  1. The cart survives a full page reload.
 *  2. Directly manipulating localStorage is reflected in the UI after reload,
 *     proving the badge is driven by persisted storage rather than in-memory state.
 */
test.describe('Cart state persistence', () => {
  test('cart survives a page reload', async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('badge reflects localStorage manipulation after reload', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.expectCartCount(0);

    // Seed the cart directly in storage (item ids 4 and 1 exist in the catalog).
    await page.evaluate(() => {
      window.localStorage.setItem('cart-contents', JSON.stringify([4, 1]));
    });
    await page.reload();

    await inventoryPage.expectCartCount(2);

    // Clearing storage should empty the cart after reload.
    await page.evaluate(() => {
      window.localStorage.removeItem('cart-contents');
    });
    await page.reload();
    await inventoryPage.expectCartCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
