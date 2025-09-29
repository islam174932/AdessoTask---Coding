const { expect } = require("@playwright/test");

class OwnersPage {
  constructor(page) {
    this.page = page;
  }

  findOwnersNav() {
    return this.page.getByRole("link", { name: "Find owners" });
  }

  lastNameInput() {
    return this.page.locator('input[name="lastName"]');
  }

  findOwnerButton() {
    return this.page.getByRole("button", { name: "Find Owner" });
  }

  ownersTable() {
    return this.page.locator("table#owners");
  }

  ownerRows() {
    return this.ownersTable().locator("tbody tr");
  }

  getOwnerRowByName(name) {
    return this.ownerRows().filter({ hasText: name });
  }

  async validateDavisOwners() {
    const bettyRow = this.getOwnerRowByName("Betty Davis").first();
    const haroldRow = this.getOwnerRowByName("Harold Davis").first();
    // Validate Betty Davis
    await expect(bettyRow.getByRole("link", { name: "Betty Davis" })).toBeVisible();
    await expect(bettyRow.getByText("638 Cardinal Ave.")).toBeVisible();
    await expect(bettyRow.getByText("Sun Prairie")).toBeVisible();
    await expect(bettyRow.getByText("6085551749")).toBeVisible();
    await expect(bettyRow.getByText("Basil")).toBeVisible();
    // Validate Harold Davis
    await expect(haroldRow.getByRole("link", { name: "Harold Davis" })).toBeVisible();
    await expect(haroldRow.getByText("563 Friendly St.")).toBeVisible();
    await expect(haroldRow.getByText("Windsor")).toBeVisible();
    await expect(haroldRow.getByText("6085553198")).toBeVisible();
    await expect(haroldRow.getByText("Iggy")).toBeVisible();
  }
}

module.exports = { OwnersPage };
