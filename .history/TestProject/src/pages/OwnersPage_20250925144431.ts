import { Page, Locator, expect } from "@playwright/test";

export class OwnersPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  findOwnersNav(): Locator {
    return this.page.getByRole("link", { name: "Find owners" });
  }

  lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]');
  }

  findOwnerButton(): Locator {
    return this.page.getByRole("button", { name: "Find Owner" });
  }

  ownersTable(): Locator {
    return this.page.locator("table#owners");
  }

  ownerRows(): Locator {
    return this.ownersTable().locator("tbody tr");
  }

  getOwnerRowByName(name: string): Locator {
    return this.ownerRows().filter({ hasText: name });
  }

  async validateDavisOwners() {
    const bettyRow = this.getOwnerRowByName("Betty Davis").first();
    const haroldRow = this.getOwnerRowByName("Harold Davis").first();
    // Validate Betty Davis
    await expect(
      bettyRow.getByRole("link", { name: "Betty Davis" })
    ).toBeVisible();
    await expect(bettyRow.getByText("638 Cardinal Ave.")).toBeVisible();
    await expect(bettyRow.getByText("Sun Prairie")).toBeVisible();
    await expect(bettyRow.getByText("6085551749")).toBeVisible();
    await expect(bettyRow.getByText("Basil")).toBeVisible();
    // Validate Harold Davis
    await expect(
      haroldRow.getByRole("link", { name: "Harold Davis" })
    ).toBeVisible();
    await expect(haroldRow.getByText("563 Friendly St.")).toBeVisible();
    await expect(haroldRow.getByText("Windsor")).toBeVisible();
    await expect(haroldRow.getByText("6085553198")).toBeVisible();
    await expect(haroldRow.getByText("Iggy")).toBeVisible();
  }
}
