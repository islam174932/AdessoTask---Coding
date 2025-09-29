import { Page, Locator } from "@playwright/test";

export class PetPage {
  constructor(private readonly page: Page) {}

  nameInput(): Locator {
    return this.page.locator('#name');
  }

  birthDateInput(): Locator {
    return this.page.locator('#birthDate');
  }

  typeSelect(): Locator {
    return this.page.locator('#type');
  }

  submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }
}
