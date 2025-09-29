import { Page, Locator } from "@playwright/test";

export class PetPage {
  constructor(private readonly page: Page) {}

  addNewPetButton(): Locator {
    return this.page.locator('a.btn.btn-primary:has-text("Add New Pet")');
  }

  nameInput(): Locator {
    return this.page.locator("#name");
  }

  birthDateInput(): Locator {
    return this.page.locator("#birthDate");
  }

  typeSelect(): Locator {
    return this.page.locator("#type");
  }

  submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  petsTable(): Locator {
    return this.page.locator("table").nth(1); // Second table on owner details page
  }

  petNameLink(petName: string): Locator {
    return this.page.locator(`a:has-text("${petName}")`);
  }
}
