import { When, Then } from "@cucumber/cucumber";
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
    await this.ownersPage!.validateDavisOwners();
  }
);

Then(
  "I should be able to click the Next page link",
  { timeout: 10000 },
  async function (this: CustomWorld) {
    await this.ownersPage!.clickNextPage();
  }
);
