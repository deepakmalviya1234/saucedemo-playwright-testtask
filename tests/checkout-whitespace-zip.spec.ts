import { test, expect } from '../src/fixtures/test-options';

/**
 * INTENTIONALLY FAILING TEST — asserts the CORRECT behavior for BUG-01.
 *
 * BUG-01 (see BUGS.md): the checkout form accepts a whitespace-only postal code
 * and proceeds to the overview step, instead of rejecting it as a required
 * field. This test encodes the EXPECTED (correct) behavior — that a
 * whitespace-only postal code is rejected — so it fails against the current
 * buggy app. When the defect is fixed, this test will pass.
 */
test.describe('Checkout — whitespace postal code (BUG-01)', () => {
  test('rejects a whitespace-only postal code', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('John', 'Doe', ' ');
    await checkoutPage.continue();

    // Expected/correct behavior: the app should reject the blank zip.
    // The app currently accepts it, so this assertion fails on purpose.
    await expect(checkoutPage.errorMessage).toHaveText(
      'Error: Postal Code is required',
    );
  });
});
