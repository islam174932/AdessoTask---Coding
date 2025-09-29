When("I enter owner details:", async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  this.lastOwner = owner; // Store for later validation
  await this.addOwnerPage!.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage!.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage!.addressInput().fill(owner.address);
  await this.addOwnerPage!.cityInput().fill(owner.city);
  await this.addOwnerPage!.telephoneInput().fill(owner.telephone);
});
When("I update owner details:", async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  await this.page!.waitForTimeout(500); // Wait for page to stabilize
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page!.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});
When("I enter pet details:", async function (this: CustomWorld, dataTable) {
  const pet = dataTable.hashes()[0];
  await this.page!.locator('input[name="name"]').fill(pet.name);
  await this.page!.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page!.locator('select[name="type"]').selectOption({ value: pet.type });
});
When("I enter visit details:", async function (this: CustomWorld, dataTable) {
  const data = dataTable.hashes()[0];
  if (data.date) {
    await this.page!.locator('input[name="date"]').fill(data.date);
  }
  await this.page!.locator('#description').fill(data.description);
});
import { Page } from "playwright";

// Robust input filler for flaky fields
async function fillInput(page: Page, selector: string, text: string) {
  await page.waitForSelector(selector, { state: "visible", timeout: 10000 });
  try {
    await page.fill(selector, text);
    const value = await page.inputValue(selector);
    if (value === text) {
      // Fire input/change events to trigger any listeners
      await page.evaluate(
        ({ selector, value }) => {
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLInputElement).value = value;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        },
        { selector, value: text }
      );
      return;
    }
  } catch {}
  await page.click(selector);
  await page.keyboard.press("Control+A");
  await page.keyboard.type(text, { delay: 100 });
  // Fire input/change events after typing
  await page.evaluate(
    ({ selector, value }) => {
      const el = document.querySelector(selector);
      if (el) {
        (el as HTMLInputElement).value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    { selector, value: text }
  );
}
// ...existing code...
import { Given, When, Then } from "@cucumber/cucumber";
import * as fs from "fs";
import * as path from "path";
import { expect } from "@playwright/test";
import { OwnersPage } from "../../src/pages/OwnersPage.ts";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage.ts";
import { CustomWorld } from "../support/world.ts";

Given("I open the home page", async function (this: CustomWorld) {
  await this.page!.goto("http://localhost:8081/");
  this.ownersPage = new OwnersPage(this.page!);
  this.homePage = new (await import("../../src/pages/HomePage.ts")).HomePage(
    this.page!
  );
});

// ...existing code...
import * as fs from "fs";
import * as path from "path";
const testData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/testdata.json'), 'utf8'));

When("I enter owner details from JSON", async function (this: CustomWorld) {
  const owner = testData.owner;
  this.lastOwner = owner;
  await this.addOwnerPage!.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage!.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage!.addressInput().fill(owner.address);
  await this.addOwnerPage!.cityInput().fill(owner.city);
  await this.addOwnerPage!.telephoneInput().fill(owner.telephone);
});

When("I update owner details from JSON", async function (this: CustomWorld) {
  const owner = testData.owner;
  await this.page!.waitForTimeout(500);
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page!.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});

When("I enter pet details from JSON", async function (this: CustomWorld) {
  const pet = testData.pet;
  await this.page!.locator('input[name="name"]').fill(pet.name);
  await this.page!.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page!.locator('select[name="type"]').selectOption({ value: pet.type });
});

When("I enter visit details from JSON", async function (this: CustomWorld) {
  const visit = testData.visit;
  if (visit.date) {
    await this.page!.locator('input[name="date"]').fill(visit.date);
  }
  await this.page!.locator('#description').fill(visit.description);
});
});

When("I load updated owner data from {string}", async function (this: CustomWorld, jsonFile: string) {
  const filePath = path.resolve(__dirname, '../../data', jsonFile);
  const owner = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  this.updatedOwner = owner;
});

When("I enter loaded updated owner details", async function (this: CustomWorld) {
  const owner = this.updatedOwner;
  await this.page!.waitForTimeout(500);
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page!.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  const updateButton = this.page!.locator("button.btn.btn-primary", {
    hasText: "Update Owner",
  });
  await updateButton.waitFor({ state: "visible", timeout: 10000 });
  await updateButton.click();
  // Wait for navigation to owner details page after update
  await this.page!.waitForSelector("h2", { state: "visible", timeout: 10000 });
  await this.page!.waitForTimeout(2000); // Extra wait for page to stabilize
});

Then(
  "I should see the updated owner {string} with address {string}, city {string}, and telephone {string}",
  async function (
    this: CustomWorld,
    fullName: string,
    address: string,
    city: string,
    telephone: string
  ) {
    await expect(this.page!.getByText(fullName)).toBeVisible();
    await expect(this.page!.getByText(address)).toBeVisible();
    await expect(this.page!.getByText(city)).toBeVisible();
    await expect(this.page!.getByText(telephone)).toBeVisible();
  }
);

When("I click the Add New Pet button", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Add New Pet" }).click();
});

When("I load pet data from {string}", async function (this: CustomWorld, jsonFile: string) {
  const filePath = path.resolve(__dirname, '../../data', jsonFile);
  const pet = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  this.lastPet = pet;
});

When("I enter loaded pet details", async function (this: CustomWorld) {
  const pet = this.lastPet;
  await this.page!.locator('input[name="name"]').fill(pet.name);
  await this.page!.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page!.locator('select[name="type"]').selectOption({ value: pet.type });
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.page!.getByRole("button", { name: "Add Pet" }).click();
  await this.page!.waitForTimeout(1500); // Wait for page to update
});

Then(
  "I should see the new pet {string} with birth date {string} and type {string} for owner {string}",
  async function (this: CustomWorld, petName, birthDate, type, ownerName) {
    // Validate pet appears in owner's pet list
    await expect(this.page!.getByText(ownerName)).toBeVisible();
    await expect(this.page!.getByText(petName)).toBeVisible();
    await expect(this.page!.getByText(birthDate)).toBeVisible();
    await expect(this.page!.getByText(type)).toBeVisible();
  }
);

When("I click the pet name link {string}", async function (petName) {
  const page = this.page!;
  // Find the pet link by name in the owner's details page
  await page.click(`text=${petName}`);
});

When("I click the Add Visit button", async function () {
  const page = this.page!;
  // Find and click the Add Visit button (link or button)
  await page.click('a[href*="visits/new"], button:has-text("Add Visit")');
});

// ...existing code...

When("I load visit data from {string}", async function (this: CustomWorld, jsonFile: string) {
  const filePath = path.resolve(__dirname, '../../data', jsonFile);
  const visit = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  this.lastVisit = visit;
});

When("I enter loaded visit details", async function (this: CustomWorld) {
  const visit = this.lastVisit;
  if (visit.date) {
    await this.page!.locator('input[name="date"]').fill(visit.date);
  }
  await this.page!.locator('#description').fill(visit.description);
});

// Take screenshot of filled form
// ...existing code...

When("I submit the Add Visit form", async function () {
  const page = this.page!;
  // Click the correct Add Visit submit button
  await page.locator("button.btn.btn-primary[type='submit']").click();
  // Wait for navigation or page update
  await page.waitForLoadState("networkidle");
});
