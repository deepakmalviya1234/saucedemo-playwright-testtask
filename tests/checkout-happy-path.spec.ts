import { test, expect } from '../src/fixtures/test-options';

/**
 * Happy-path E2E: an authenticated user adds items, checks out, and completes
 * the order. Uses the shared authenticated storageState (no UI login here).
 */
test.describe('Checkout happy path', () => {
  test('completes an order end to end', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.expectLoaded();

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartCount(2);

    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    await cartPage.expectItemCount(2);
    await cartPage.expectContainsProduct('Sauce Labs Backpack');
    await cartPage.expectContainsProduct('Sauce Labs Bike Light');

    await cartPage.checkout();
    await checkoutPage.fillInformation('John', 'Doe', '10001');
    await checkoutPage.continue();

    await checkoutPage.expectOnOverview();
    await checkoutPage.expectTotalsAreConsistent();

    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });
});
