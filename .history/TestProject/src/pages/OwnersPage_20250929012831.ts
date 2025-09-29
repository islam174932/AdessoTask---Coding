import { expect, Locator, Page } from "@playwright/test";

export class OwnersPage {
  constructor(private readonly page: import("playwright").Page) {}

  findOwnersNav() {
    return this.page.getByRole("link", { name: "Find owners" });
  }

  lastNameInput() {
    return this.page.locator('input[name="lastName"]');
  }

  findOwnerButton() {
    return this.page.getByRole("button", { name: "Find Owner" });
  }

  getOwnerRowByName(fullName: string) {
    return this.page.locator(
      `table#owners tbody tr:has(a:has-text('${fullName}'))`
    );
  }

  // Add this method for owner link clicking
  getOwnerLinkByHref(fullName: string) {
    return this.page.locator(`a[href*="/owners/"]:has-text("${fullName}")`);
  }
}
