import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnersPage } from "../../src/pages/OwnersPage.ts";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage.ts";
import { CustomWorld } from "../support/world.ts";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataPath = path.join(__dirname, '../../data/testdata.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

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

When("I submit the Add Visit form", async function () {
  const page = this.page!;
  // Click the correct Add Visit submit button
  await page.locator("button.btn.btn-primary[type='submit']").click();
  // Wait for navigation or page update
  await page.waitForLoadState("networkidle");
});
