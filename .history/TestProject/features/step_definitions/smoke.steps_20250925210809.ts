import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage.ts";
import { OwnersPage } from "../../src/pages/OwnersPage.ts";
import { CustomWorld } from "../support/world.ts";

When("I click the Home icon", async function (this: CustomWorld) {
  if (!this.homePage) {
    this.homePage = new (await import("../../src/pages/HomePage.ts")).HomePage(
      this.page!
    );
  }
  await this.homePage.clickHome();
});

Then("I should see the Welcome header", async function (this: CustomWorld) {
  expect(await this.homePage.isWelcomeVisible()).toBeTruthy();
});

When(
  "I enter {string} in the last name field",
  async function (this: CustomWorld, lastName: string) {
    await this.ownersPage.lastNameInput().fill(lastName);
  }
);

Then(
  "I should see the Owners table with correct Davis entries",
  async function (this: CustomWorld) {
    await this.ownersPage.validateDavisOwners();
  }
);
