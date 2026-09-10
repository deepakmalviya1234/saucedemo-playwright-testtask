import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object covering both checkout steps:
 * - Step One (`/checkout-step-one.html`): customer information form.
 * - Step Two (`/checkout-step-two.html`): order overview and totals.
 * - Complete (`/checkout-complete.html`): order confirmation.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    // Inputs have placeholders but no <label>; placeholder text is the most
    // human-readable stable hook available.
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.getByText('Thank you for your order!');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
  }

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }

  async expectOnOverview(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.completeHeader).toBeVisible();
  }

  /**
   * Reads the numeric value out of a summary label such as
   * "Item total: $29.99" or "Tax: $2.40".
   */
  private async readAmount(label: Locator): Promise<number> {
    const text = (await label.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    return match ? Number(match[1]) : NaN;
  }

  async expectTotalsAreConsistent(): Promise<void> {
    const itemTotal = await this.readAmount(this.itemTotalLabel);
    const tax = await this.readAmount(this.taxLabel);
    const total = await this.readAmount(this.totalLabel);
    // Total shown must equal item total + tax (allow float rounding).
    expect(Math.abs(itemTotal + tax - total)).toBeLessThan(0.01);
  }
}
