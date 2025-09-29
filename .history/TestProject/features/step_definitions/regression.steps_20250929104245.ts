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
      "JSON path:",
      path.resolve(__dirname, "../../data/testdata.json")

    const testData = await loadJson("../../data/testdata.json");
    console.log("Loaded test data:", testData);

    let owner;
    if (index === 0) {
      owner = testData.initialOwner;
    } else if (index === 1) {
      owner = testData.updatedOwner;
    } else {
      throw new Error(
        `No owner data found for index ${index}. Available indices: 0 (initialOwner), 1 (updatedOwner)`
    }

    console.log(`Using owner data for index ${index}:`, owner);
    this.lastOwner = owner;

    await this.page.screenshot({
      path: "before-form-fill.png",
    });

    console.log("Waiting for firstName input...");
      .firstNameInput()
      .waitFor({ state: "visible", timeout: 10000 });
    await this.addOwnerPage.firstNameInput().fill(owner.firstName);

    console.log("Waiting for lastName input...");
      .lastNameInput()
      .waitFor({ state: "visible", timeout: 10000 });
    await this.addOwnerPage.lastNameInput().fill(owner.lastName);

    console.log("Waiting for address input...");
      .addressInput()
      .waitFor({ state: "visible", timeout: 10000 });
    await this.addOwnerPage.addressInput().fill(owner.address);

    console.log("Waiting for city input...");
      .cityInput()
      .waitFor({ state: "visible", timeout: 10000 });
    await this.addOwnerPage.cityInput().fill(owner.city);

    console.log("Waiting for telephone input...");
      .telephoneInput()
      .waitFor({ state: "visible", timeout: 10000 });
    await this.addOwnerPage.telephoneInput().fill(owner.telephone);
    console.log("Form filling completed successfully!");
  } catch (error) {
    console.log("ERROR during form filling:", error.message);
    try {
      await this.page.screenshot({
        path: "form-fill-error.png",
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

    await submitBtn.waitFor({ state: "visible", timeout: 15000 });

    await submitBtn.click();

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

    await this.page.waitForSelector('h2:has-text("Owner Information")', {
    });

    console.log("Validating new owner details...");

    const detailsTable = this.page.locator("table.table-striped").first();

    await expect(
      detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
    ).toBeVisible();
    await expect(detailsTable.getByText(owner.address)).toBeVisible();
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

    await this.addOwnerPage.firstNameInput().clear();
    await this.addOwnerPage.lastNameInput().clear();
    await this.addOwnerPage.addressInput().clear();
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
      }

      this.updatedOwner = owner;

      await this.addOwnerPage.firstNameInput().fill(owner.firstName);

      await this.addOwnerPage.lastNameInput().fill(owner.lastName);

      await this.addOwnerPage.addressInput().fill(owner.address);

      await this.addOwnerPage.cityInput().fill(owner.city);

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
  await this.addOwnerPage.addOwnerSubmitButton().click();
  await this.page.waitForLoadState("networkidle", { timeout: 15000 });
});

Then("I should see the updated owner details", async function () {
  try {
    const owner = this.updatedOwner;

    await this.page.waitForSelector('h2:has-text("Owner Information")', {
    });

    console.log("Validating updated owner details...");

    const detailsTable = this.page.locator("table.table-striped").first();

    await expect(
      detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
    ).toBeVisible();
    await expect(detailsTable.getByText(owner.address)).toBeVisible();
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
  const pet = testData.newPet;
  if (!pet) throw new Error(`No pet data found in testdata.json`);

  const uniqueName = `${pet.name}_${Date.now()}`;
  this.currentPetName = uniqueName;

  await this.petPage.nameInput().fill(uniqueName);
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
    await expect(petsTable).toContainText(this.currentPetName);
    await expect(petsTable).toContainText(birthDate);
    await expect(petsTable).toContainText(type);
  }
);

When("I click the pet name link {string}", async function (petName) {
  try {
    const petLink = this.page
      .locator(`a[href*="/pets/"]:has-text("${petName}")`)
      .first();
    await expect(petLink).toBeVisible({ timeout: 10000 });
    await petLink.click();
  } catch (error) {
    console.log(
      `Could not find pet link for "${petName}", trying to find any pet link...`
    );
    const anyPetLink = this.page.locator('a[href*="/pets/"]').first();
    await expect(anyPetLink).toBeVisible({ timeout: 10000 });
    await anyPetLink.click();
  }
});

When("I click the pet name link for current pet", async function () {
  try {
    const petLink = this.page.locator('a[href*="/pets/"]').first();
    await expect(petLink).toBeVisible({ timeout: 10000 });
    await petLink.click();
    console.log("Clicked on the first available pet link");
  } catch (error) {
    console.log("ERROR clicking pet link:", error.message);
    await this.page.screenshot({ path: "pet-link-error.png", fullPage: true });
    throw error;
  }
});

When("I click the Add Visit button", async function () {
  try {
    await this.page.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });
    await this.page.waitForTimeout(1000);

    const addVisitButton = this.visitPage.addVisitButton();
    await addVisitButton.click();
    console.log("Add Visit button clicked successfully");
  } catch (error) {
    console.log("ERROR clicking Add Visit button:", error.message);
    await this.page.screenshot({ path: "add-visit-error.png", fullPage: true });
    throw error;
  }
});
When("I enter visit details from json for index {int}", async function (index) {
  try {
    console.log("Loading visit data...");
    const testData = await loadJson("../../data/testdata.json");
    if (!visit) throw new Error(`No visit data found in testdata.json`);

    this.currentVisit = visit;

    await this.visitPage.descriptionInput().fill(visit.description);
    console.log("Visit form filled successfully");
  } catch (error) {
    console.log("ERROR filling visit details:", error.message);
    await this.page.screenshot({
      path: "visit-fill-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When("I submit the Add Visit form", async function () {
  await this.visitPage.submitButton().click();
  await this.page.waitForLoadState("networkidle");
});
