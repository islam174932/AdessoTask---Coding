import { Page, Locator, expect } from "@playwright/test";

export class AlertPage {
  constructor(private readonly page: Page) {}

  // Success alert locator
  successAlert(): Locator {
    return this.page.locator("#success-message");
  }

  // Specific success messages
  newOwnerCreatedMessage(): Locator {
    return this.successAlert().locator('span:has-text("New Owner Created")');
  }

  ownerUpdatedMessage(): Locator {
    return this.successAlert().locator('span:has-text("Owner Values Updated")');
  }

  newPetAddedMessage(): Locator {
    return this.successAlert().locator(
      'span:has-text("New Pet has been Added")'
    );
  }

  visitBookedMessage(): Locator {
    return this.successAlert().locator(
      'span:has-text("Your visit has been booked")'
    );
  }

  // Generic success message locator
  successMessageText(): Locator {
    return this.successAlert().locator("span");
  }

  // Validation methods
  async validateNewOwnerCreated() {
    await this.page.waitForTimeout(500); // Wait for alert to appear
    const alertText = await this.successMessageText().textContent();
    expect(alertText?.trim()).toBe("New Owner Created");
  }

  async validateOwnerUpdated() {
    await this.page.waitForTimeout(500);
    const alertText = await this.successMessageText().textContent();
    expect(alertText?.trim()).toBe("Owner Values Updated");
  }

  async validateNewPetAdded() {
    await this.page.waitForTimeout(500);
    const alertText = await this.successMessageText().textContent();
    expect(alertText?.trim()).toBe("New Pet has been Added");
  }

  async validateVisitBooked() {
    await this.page.waitForTimeout(500);
    const alertText = await this.successMessageText().textContent();
    expect(alertText?.trim()).toBe("Your visit has been booked");
  }

  async isSuccessAlertVisible(): Promise<boolean> {
    try {
      await this.successAlert().waitFor({ state: "visible", timeout: 3000 });
      return true;
    } catch (e) {
      return false;
    }
  }
}
