import { Page, Locator } from "@playwright/test";

export class AddOwnerPage {
  constructor(private readonly page: Page) {}

  firstNameInput(): Locator {
    return this.page.locator('input[name="firstName"]');
  }

  lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]');
  }

  addressInput(): Locator {
    return this.page.locator('input[name="address"]');
  }

  cityInput(): Locator {
    return this.page.locator('input[name="city"]');
  }

  telephoneInput(): Locator {
    return this.page.locator('input[name="telephone"]');
  }

  addOwnerButton(): Locator {
    return this.page.getByRole("button", { name: "Add Owner" });
  }
}
