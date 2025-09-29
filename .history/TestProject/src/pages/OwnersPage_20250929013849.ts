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

  // Get owner link by name and specific owner ID (href)
  getOwnerLinkByNameAndId(fullName: string, ownerId: string) {
    return this.page.locator(
      `a[href="/owners/${ownerId}"]:has-text("${fullName}")`
    );
  }
  // Retain generic method for all links by name
  getOwnerLinkByHref(fullName: string) {
    return this.page.locator(`a[href*="/owners/"]:has-text("${fullName}")`);
  }
}
