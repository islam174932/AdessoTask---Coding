import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnersPage } from "../../src/pages/OwnersPage";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage";
import { PetPage } from "../../src/pages/PetPage";
import { VisitPage } from "../../src/pages/VisitPage";
import { HomePage } from "../../src/pages/HomePage";
import { VetsPage } from "../../src/pages/VetsPage";
import { ErrorPage } from "../../src/pages/ErrorPage";
import { AlertPage } from "../../src/pages/AlertPage";
import { CustomWorld } from "../support/world";
import * as fs from "fs";
import * as path from "path";


export async function loadJson(relativePath: string, currentDir: string) {
  const fullPath = path.resolve(currentDir, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}



Given("I open the home page", async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  this.ownersPage = new OwnersPage(this.page!);
  this.addOwnerPage = new AddOwnerPage(this.page!);
  this.petPage = new PetPage(this.page!);
  this.visitPage = new VisitPage(this.page!);
  this.alertPage = new AlertPage(this.page!);
  await this.homePage.open();
  await this.homePage.waitForWelcome();
});

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.ownersPage!.findOwnersNav().click();
});

When("I click the Home icon", async function (this: CustomWorld) {
  await this.homePage!.clickHome();
});

Then("I should see the Welcome header", async function (this: CustomWorld) {
  const isVisible = await this.homePage!.isWelcomeVisible();
  expect(isVisible).toBeTruthy();
});

When(
  "I enter last name {string} in the search field",
  async function (this: CustomWorld, lastName: string) {
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  await this.ownersPage!.findOwnerButton().click();
});

When(
  "I click the owner link {string} with address {string}",
  async function (this: CustomWorld, fullName: string, address: string) {
    const row = this.ownersPage!.getOwnerRowByName(fullName)
      .filter({ hasText: address })
      .first();
    const nameLink = row.getByRole("link", { name: fullName });
    await expect(nameLink).toBeVisible();
    await nameLink.click();
  }
);

When("I click the Veterinarians link", async function (this: CustomWorld) {
  const vetsPage = new VetsPage(this.page!);
  await vetsPage.veterinariansLink().click();
});

Then(
  "I should see the Veterinarians table with correct data",
  async function (this: CustomWorld) {
    const vetsPage = new VetsPage(this.page!);
    await vetsPage.validateVeterinariansTable();
  }
);

When("I click the Error link", async function (this: CustomWorld) {
  const errorPage = new ErrorPage(this.page!);
  await errorPage.errorLink().click();
});

Then(
  "I should see the Something happened header",
  async function (this: CustomWorld) {
    const errorPage = new ErrorPage(this.page!);
    await errorPage.validateErrorPage();
  }
);

Then("the browser will be closed", async function (this: CustomWorld) {
  if (this.homePage) {
    await this.homePage.close();
  } else if (this.page) {
    await this.page!.close();
  }
});
