import { Page, Locator } from "@playwright/test";

export class VisitPage {
  constructor(private readonly page: Page) {}

  dateInput(): Locator {
    return this.page.locator("#date");
  }

  descriptionInput(): Locator {
    return this.page.locator("#description");
  }

  submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }
  addVisitButton() {
    // Click the first Add Visit link
    return this.page
      .locator('a[href*="/visits/new"]:has-text("Add Visit")')
      .first();
  }
}
