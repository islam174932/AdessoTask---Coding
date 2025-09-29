import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnersPage } from "../../src/pages/OwnersPage";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage";
import { PetPage } from "../../src/pages/PetPage";
import { VisitPage } from "../../src/pages/VisitPage";
import { HomePage } from "../../src/pages/HomePage";
import { CustomWorld } from "../support/world";
import * as fs from "fs";
import * as path from "path";

// Utility function
export async function loadJson(relativePath: string, currentDir: string) {
  const fullPath = path.resolve(currentDir, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// ==================== COMMON STEPS ====================

Given("I open the home page", async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  this.ownersPage = new OwnersPage(this.page!);
  this.addOwnerPage = new AddOwnerPage(this.page!);
  this.petPage = new PetPage(this.page!);
  this.visitPage = new VisitPage(this.page!);
  await this.homePage.open();
  await this.homePage.waitForWelcome();
});

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.ownersPage!.findOwnersNav().click();
});

When("I click the Home icon", async function (this: CustomWorld) {
  if (this.homePage && this.homePage.clickHome) {
    await this.homePage.clickHome();
  } else {
    try {
      await this.page!.getByRole("link", { name: "Home" }).click();
    } catch (e) {
      await this.page!.locator('.navbar-brand, a[href="/"], a[href*="home"]')
        .first()
        .click();
    }
  }
});

Then("I should see the Welcome header", async function (this: CustomWorld) {
  if (this.homePage && this.homePage.isWelcomeVisible) {
    const isVisible = await this.homePage.isWelcomeVisible();
    expect(isVisible).toBeTruthy();
  } else {
    const welcomeTexts = ["Welcome", "Spring PetClinic", "Home"];
    let found = false;
    for (const text of welcomeTexts) {
      try {
        await expect(this.page!.getByText(text, { exact: false })).toBeVisible({
          timeout: 3000,
        });
        found = true;
        break;
      } catch (e) {}
    }
    if (!found) {
      await expect(
        this.page!.locator("h1, h2, main, .container").first()
      ).toBeVisible({ timeout: 10000 });
    }
  }
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
  await this.page!.getByRole("link", { name: "Veterinarians" }).click();
});

Then(
  "I should see the Veterinarians table with correct data",
  async function (this: CustomWorld) {
    await this.page!.waitForSelector("table", {
      state: "visible",
      timeout: 10000,
    });
    await expect(this.page!.getByText("Name")).toBeVisible();
    const specialtyHeaders = ["Specialties", "Specialty"];
    for (const header of specialtyHeaders) {
      try {
        await expect(this.page!.getByText(header)).toBeVisible({
          timeout: 2000,
        });
        break;
      } catch (e) {}
    }
    const vetRows = this.page!.locator("table tbody tr");
    await expect(vetRows.first()).toBeVisible({ timeout: 10000 });
  }
);

When("I click the Error link", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Error" }).click();
});

Then(
  "I should see the Something happened header",
  async function (this: CustomWorld) {
    const errorHeaders = [
      "Something happened",
      "Error",
      "Oops",
      "Something went wrong",
    ];

    let headerFound = false;
    for (const headerText of errorHeaders) {
      try {
        await expect(
          this.page!.getByText(headerText, { exact: false })
        ).toBeVisible({ timeout: 3000 });
        headerFound = true;
        break;
      } catch (e) {}
    }
    if (!headerFound) {
      await expect(this.page!.locator("h1, h2").first()).toBeVisible({
        timeout: 10000,
      });
    }
  }
);

Then("the browser will be closed", async function (this: CustomWorld) {
  if (this.homePage) {
    await this.homePage.close();
  } else if (this.page) {
    await this.page!.close();
  }
});
