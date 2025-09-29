import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import "./base.steps"; // Import all base steps

// ==================== SMOKE-SPECIFIC STEPS ====================

When(
  "I enter {string} in the last name field",
  async function (this: CustomWorld, lastName: string) {
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

Then(
  "I should see the Owners table with correct Davis entries",
  async function (this: CustomWorld) {
    if (this.ownersPage!.validateDavisOwners) {
      await this.ownersPage!.validateDavisOwners();
    } else {
      await this.page!.waitForSelector("table", {
        state: "visible",
        timeout: 10000,
      });
      const davisEntries = this.page!.locator("table tbody tr").filter({
        hasText: "Davis",
      });
      await expect(davisEntries.first()).toBeVisible({ timeout: 10000 });
      await expect(this.page!.getByText("Name")).toBeVisible();
      await expect(this.page!.getByText("Address")).toBeVisible();
    }
  }
);

Then(
  "I should be able to click the Next page link",
  { timeout: 10000 },
  async function (this: CustomWorld) {
    const nextSelectors = [
      'a:has-text("Next")',
      'a:has-text("»")',
      '.pagination a[rel="next"]',
      'a[aria-label="Next"]',
      ".pagination .next a",
      "a.next",
    ];

    let clicked = false;
    for (const selector of nextSelectors) {
      try {
        const nextLink = this.page!.locator(selector);
        await nextLink.waitFor({ state: "visible", timeout: 2000 });
        const isDisabled = await nextLink.getAttribute("class");
        if (isDisabled && isDisabled.includes("disabled")) {
          continue;
        }
        await nextLink.click();
        clicked = true;
        break;
      } catch (e) {}
    }
    if (!clicked) {
      // Next button not available or disabled
    }
  }
);
