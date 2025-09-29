import { expect, Locator, Page } from "@playwright/test";

export class OwnersPage {
  constructor(private readonly page: Page) {} // Fixed: Use Page instead of import("playwright").Page

  // Navigation
  findOwnersNav(): Locator {
    return this.page.getByRole("link", { name: "Find owners" });
  }

  // Search elements
  lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]');
  }

  findOwnerButton(): Locator {
    return this.page.getByRole("button", { name: "Find Owner" });
  }

  // Table elements
  ownersTable(): Locator {
    return this.page.locator("table#owners");
  }

  getOwnerRowByName(fullName: string): Locator {
    return this.page.locator(
      `table#owners tbody tr:has(a:has-text('${fullName}'))`
    );
  }

  getOwnerLinkByNameAndId(fullName: string, ownerId: string): Locator {
    return this.page.locator(
      `a[href="/owners/${ownerId}"]:has-text("${fullName}")`
    );
  }

  getOwnerLinkByHref(fullName: string): Locator {
    return this.page.locator(`a[href*="/owners/"]:has-text("${fullName}")`);
  }

  getEditOwnerButton(): Locator {
    return this.page.locator('a.btn.btn-primary:has-text("Edit Owner")');
  }

  // Table headers
  nameHeader(): Locator {
    return this.page.getByText("Name");
  }

  addressHeader(): Locator {
    return this.page.getByText("Address");
  }

  cityHeader(): Locator {
    return this.page.getByText("City");
  }

  telephoneHeader(): Locator {
    return this.page.getByText("Telephone");
  }

  // Validation methods
  async validateDavisOwners() {
    await this.page.waitForSelector("table", {
      state: "visible",
      timeout: 10000,
    });

    const davisEntries = this.page.locator("table tbody tr").filter({
      hasText: "Davis",
    });

    await expect(davisEntries.first()).toBeVisible({ timeout: 10000 });
    await expect(this.nameHeader()).toBeVisible();
    await expect(this.addressHeader()).toBeVisible();
  }

  async clickNextPage(): Promise<boolean> {
    const nextSelectors = [
      'a:has-text("Next")',
      'a:has-text("»")',
      '.pagination a[rel="next"]',
      'a[aria-label="Next"]',
      ".pagination .next a",
      "a.next",
    ];

    for (const selector of nextSelectors) {
      try {
        const nextLink = this.page.locator(selector);
        await nextLink.waitFor({ state: "visible", timeout: 2000 });

        const isDisabled = await nextLink.getAttribute("class");
        if (isDisabled && isDisabled.includes("disabled")) {
          continue;
        }

        await nextLink.click();
        return true;
      } catch (e) {
        continue;
      }
    }

    return false;
  }

  async waitForOwnersTable() {
    await this.page.waitForSelector("table", {
      state: "visible",
      timeout: 10000,
    });
  }
}
