const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { OwnersPage } = require("../../src/pages/OwnersPage.ts");
const { AddOwnerPage } = require("../../src/pages/AddOwnerPage.ts");
const { PetPage } = require("../../src/pages/PetPage.ts");
const { VisitPage } = require("../../src/pages/VisitPage.ts");
const { HomePage } = require("../../src/pages/HomePage.ts");
const fs = require("fs");
const path = require("path");

async function loadJson(relativePath) {
  const fullPath = path.resolve(__dirname, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

Given("I open the home page", async function () {
  this.homePage = new HomePage(this.page);
  this.ownersPage = new OwnersPage(this.page);
  this.addOwnerPage = new AddOwnerPage(this.page);
  this.petPage = new PetPage(this.page);
  this.visitPage = new VisitPage(this.page);
  await this.homePage.open();
  await this.homePage.waitForWelcome();
});

When("I click the Find Owners link", async function () {
  await this.ownersPage.findOwnersNav().click();
});

When("I click the Add Owner button", async function () {
  await this.addOwnerPage.addOwnerLink().click();
  await this.page
    .locator("form#add-owner-form")
    .waitFor({ state: "visible", timeout: 10000 });
  await this.page.screenshot({
    path: "add-owner-form-debug.png",
    fullPage: true,
  });
});

When("I enter owner details from json for index {int}", async function (index) {
  try {
    console.log("Starting form fill process...");
    console.log(
      "JSON path:",
      path.resolve(__dirname, "../../data/testdata.json")
    );

    const testData = await loadJson("../../data/testdata.json");
    console.log("Loaded test data:", testData);

    // Get owner based on index
    let owner;
    if (index === 0) {
      owner = testData.initialOwner;
    } else if (index === 1) {
      owner = testData.updatedOwner;
    } else {
      throw new Error(
        `No owner data found for index ${index}. Available indices: 0 (initialOwner), 1 (updatedOwner)`
      );
    }

    console.log(`Using owner data for index ${index}:`, owner);
    this.lastOwner = owner;

    // Take screenshot before filling
    await this.page.screenshot({
      path: "before-form-fill.png",
      fullPage: true,
    });

    console.log("Waiting for firstName input...");
    await this.addOwnerPage
      .firstNameInput()
      .waitFor({ state: "visible", timeout: 10000 });
    console.log("Filling firstName:", owner.firstName);
    await this.addOwnerPage.firstNameInput().fill(owner.firstName);

    console.log("Waiting for lastName input...");
    await this.addOwnerPage
      .lastNameInput()
      .waitFor({ state: "visible", timeout: 10000 });
    console.log("Filling lastName:", owner.lastName);
    await this.addOwnerPage.lastNameInput().fill(owner.lastName);

    console.log("Waiting for address input...");
    await this.addOwnerPage
      .addressInput()
      .waitFor({ state: "visible", timeout: 10000 });
    console.log("Filling address:", owner.address);
    await this.addOwnerPage.addressInput().fill(owner.address);

    console.log("Waiting for city input...");
    await this.addOwnerPage
      .cityInput()
      .waitFor({ state: "visible", timeout: 10000 });
    console.log("Filling city:", owner.city);
    await this.addOwnerPage.cityInput().fill(owner.city);

    console.log("Waiting for telephone input...");
    await this.addOwnerPage
      .telephoneInput()
      .waitFor({ state: "visible", timeout: 10000 });
    console.log("Filling telephone:", owner.telephone);
    await this.addOwnerPage.telephoneInput().fill(owner.telephone);

    console.log("Form filling completed successfully!");
  } catch (error) {
    console.log("ERROR during form filling:", error.message);
    try {
      await this.page.screenshot({
        path: "form-fill-error.png",
        fullPage: true,
      });
    } catch (screenshotError) {
      console.log("Could not take error screenshot - browser may be closed");
    }
    throw error;
  }
});

When("I submit the Add Owner form", async function () {
  try {
    console.log("About to submit form...");

    const submitBtn = this.addOwnerPage.addOwnerSubmitButton();
    await submitBtn.waitFor({ state: "visible", timeout: 15000 });

    console.log("Submit button is visible, clicking...");
    await submitBtn.click();

    console.log("Submit button clicked, waiting for navigation...");
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    console.log("Form submitted successfully!");
  } catch (error) {
    console.log("ERROR during form submission:", error.message);
    await this.page.screenshot({ path: "submit-error.png", fullPage: true });
    throw error;
  }
});

Then("I should see the new owner added", async function () {
  try {
    const owner = this.lastOwner;

    // Wait for owner details page to load after form submission
    await this.page.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });

    console.log("Validating new owner details...");

    // Validate owner details in the details table (not owners list table)
    const detailsTable = this.page.locator("table.table-striped").first();

    await expect(
      detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
    ).toBeVisible();
    await expect(detailsTable.getByText(owner.address)).toBeVisible();
    await expect(detailsTable.getByText(owner.city)).toBeVisible();
    await expect(detailsTable.getByText(owner.telephone)).toBeVisible();

    console.log("New owner details validated successfully");
  } catch (error) {
    console.log("ERROR validating new owner:", error.message);
    await this.page.screenshot({
      path: "validate-owner-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I enter last name {string} in the search field",
  async function (lastName) {
    await this.ownersPage.lastNameInput().fill(lastName);
  }
);

When("I click the Find Owner button", async function () {
  await this.ownersPage.findOwnerButton().click();
});

Then(
  "I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table",
  async function (fullName, address, city, telephone) {
    const row = this.ownersPage.getOwnerRowByName(fullName).first();
    await expect(row.getByRole("link", { name: fullName })).toBeVisible();
    await expect(row.getByText(address)).toBeVisible();
    await expect(row.getByText(city)).toBeVisible();
    await expect(row.getByText(telephone)).toBeVisible();
  }
);

When(
  "I click the owner link {string} with address {string}",
  async function (fullName, address) {
    const row = this.ownersPage
      .getOwnerRowByName(fullName)
      .filter({ hasText: address })
      .first();
    const nameLink = row.getByRole("link", { name: fullName });
    await expect(nameLink).toBeVisible();
    await nameLink.click();
  }
);

When("I click the Edit Owner button", async function () {
  const editLink = this.ownersPage.getEditOwnerButton();
  await expect(editLink).toBeVisible();
  await editLink.click();
});

When("I clear all owner fields", async function () {
  try {
    console.log("Clearing all owner fields...");

    // Clear each field
    await this.addOwnerPage.firstNameInput().clear();
    await this.addOwnerPage.lastNameInput().clear();
    await this.addOwnerPage.addressInput().clear();
    await this.addOwnerPage.cityInput().clear();
    await this.addOwnerPage.telephoneInput().clear();

    console.log("All fields cleared successfully");
  } catch (error) {
    console.log("ERROR clearing fields:", error.message);
    await this.page.screenshot({
      path: "clear-fields-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I update owner details from json for index {int}",
  async function (index) {
    try {
      console.log("Loading owner data for update...");
      const testData = await loadJson("../../data/testdata.json");

      let owner;
      if (index === 0) {
        owner = testData.initialOwner;
      } else if (index === 1) {
        owner = testData.updatedOwner;
      } else {
        throw new Error(`No owner data found for index ${index}`);
      }

      console.log(`Using owner data for index ${index}:`, owner);
      this.updatedOwner = owner; // Store for validation

      // Fill form fields with new data
      console.log("Filling firstName:", owner.firstName);
      await this.addOwnerPage.firstNameInput().fill(owner.firstName);

      console.log("Filling lastName:", owner.lastName);
      await this.addOwnerPage.lastNameInput().fill(owner.lastName);

      console.log("Filling address:", owner.address);
      await this.addOwnerPage.addressInput().fill(owner.address);

      console.log("Filling city:", owner.city);
      await this.addOwnerPage.cityInput().fill(owner.city);

      console.log("Filling telephone:", owner.telephone);
      await this.addOwnerPage.telephoneInput().fill(owner.telephone);

      console.log("Owner update form filled successfully");
    } catch (error) {
      console.log("ERROR updating owner details:", error.message);
      await this.page.screenshot({
        path: "update-owner-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

When("I update owner details:", async function (dataTable) {
  const owner = dataTable.hashes()[0];
  await this.addOwnerPage.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage.addressInput().fill(owner.address);
  await this.addOwnerPage.cityInput().fill(owner.city);
  await this.addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Update Owner form", async function () {
  await this.addOwnerPage.addOwnerSubmitButton().click(); // ✅ Correct method name
  await this.page.waitForLoadState("networkidle", { timeout: 15000 });
});

Then("I should see the updated owner details", async function () {
  try {
    const owner = this.updatedOwner;

    // Wait for owner details page to load
    await this.page.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });

    console.log("Validating updated owner details...");

    // Validate updated owner details in the details table
    const detailsTable = this.page.locator("table.table-striped").first();

    await expect(
      detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
    ).toBeVisible();
    await expect(detailsTable.getByText(owner.address)).toBeVisible();
    await expect(detailsTable.getByText(owner.city)).toBeVisible();
    await expect(detailsTable.getByText(owner.telephone)).toBeVisible();

    console.log("Updated owner details validated successfully");
  } catch (error) {
    console.log("ERROR validating updated owner:", error.message);
    await this.page.screenshot({
      path: "validate-update-error.png",
      fullPage: true,
    });
    throw error;
  }
});

Then(
  "I should see the updated owner {string} with address {string}, city {string}, and telephone {string}",
  async function (fullName, address, city, telephone) {
    const row = this.ownersPage.getOwnerRowByName(fullName).first();
    await expect(row.getByRole("link", { name: fullName })).toBeVisible();
    await expect(row.getByText(address)).toBeVisible();
    await expect(row.getByText(city)).toBeVisible();
    await expect(row.getByText(telephone)).toBeVisible();
  }
);

When("I click the Add New Pet button", async function () {
  await this.petPage.addNewPetButton().click();
});

When("I enter pet details from json for index {int}", async function (index) {
  const testData = await loadJson("../../data/testdata.json");
  const pet = testData.newPet; // Use the single pet object
  if (!pet) throw new Error(`No pet data found in testdata.json`);
  await this.petPage.nameInput().fill(pet.name);
  await this.petPage.birthDateInput().fill(pet.birthDate);
  await this.petPage.typeSelect().selectOption({ value: pet.type });
});

When("I submit the Add Pet form", async function () {
  await this.petPage.submitButton().click();
  await this.page.waitForTimeout(1500);
});

Then(
  "I should see the new pet {string} with birth date {string} and type {string} for owner {string}",
  async function (petName, birthDate, type, ownerName) {
    const petsTable = this.petPage.petsTable();
    await expect(petsTable).toContainText(ownerName);
    await expect(petsTable).toContainText(petName);
    await expect(petsTable).toContainText(birthDate);
    await expect(petsTable).toContainText(type);
  }
);

When("I click the pet name link {string}", async function (petName) {
  const petLink = this.petPage.petNameLink(petName);
  await expect(petLink).toBeVisible();
  await petLink.click();
});

When("I click the Add Visit button", async function () {
  await this.visitPage.addVisitButton().click();
});

When("I enter visit details from json for index {int}", async function (index) {
  const testData = await loadJson("../../data/testdata.json");
  const visit = testData.newVisit; // Use the single visit object
  if (!visit) throw new Error(`No visit data found in testdata.json`);
  await this.visitPage.descriptionInput().fill(visit.description);
});

When("I submit the Add Visit form", async function () {
  await this.visitPage.submitButton().click();
  await this.page.waitForLoadState("networkidle");
});
