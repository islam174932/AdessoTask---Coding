const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { OwnersPage } = require("../../src/pages/OwnersPage.ts");
const { AddOwnerPage } = require("../../src/pages/AddOwnerPage.ts");
const fs = require("fs");
const path = require("path");

// Load test data once
const testDataPath = path.resolve(process.cwd(), "./data/testdata.json");
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

Given("I open the home page", async function () {
  this.ownersPage = new OwnersPage(this.page);
  this.addOwnerPage = new AddOwnerPage(this.page);
  await this.page.goto("http://localhost:8081/");
});

When("I click the Find Owners link", async function () {
  await this.ownersPage.findOwnersNav().click();
});

When("I click the Add Owner button", async function () {
  await this.page.getByRole("link", { name: "Add Owner" }).click();
  this.addOwnerPage = new AddOwnerPage(this.page);
});

When("I enter initial owner details", async function () {
  const owner = testData.initialOwner;
  this.lastOwner = owner;

  // Wait for the add owner form to be visible and add longer timeouts
  await this.page.waitForSelector('input[name="firstName"]', {
    timeout: 10000,
  });

  // Use direct page locators with explicit waits instead of page object methods
  await this.page.locator('input[name="firstName"]').fill(owner.firstName);
  await this.page.locator('input[name="lastName"]').fill(owner.lastName);
  await this.page.locator('input[name="address"]').fill(owner.address);
  await this.page.locator('input[name="city"]').fill(owner.city);
  await this.page.locator('input[name="telephone"]').fill(owner.telephone);
});

// For backward compatibility with existing feature files
When("I enter owner details from json for index {int}", async function (index) {
  const owner = index === 0 ? testData.initialOwner : testData.updatedOwner;
  this.lastOwner = owner;

  try {
    // Debug: Take screenshot and log page info
    console.log("Current URL:", this.page.url());
    console.log("Page title:", await this.page.title());

    // Wait for page to be fully loaded with extended timeout
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(5000); // Increased wait time

    // Try multiple possible selectors for the form with longer timeout
    const possibleSelectors = [
      'input[name="firstName"]',
      "#firstName",
      'input[id="firstName"]',
      'form input[placeholder*="first" i]',
      "form input:first-of-type",
    ];

    let firstNameInput = null;
    for (const selector of possibleSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 15000 }); // Increased timeout to 15 seconds
        firstNameInput = this.page.locator(selector);
        console.log(`Found first name input with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found`);
      }
    }

    if (!firstNameInput) {
      // Take screenshot for debugging
      await this.page.screenshot({
        path: `debug-add-owner-form-${Date.now()}.png`,
      });
      throw new Error("Could not find first name input field");
    }

    // Fill the form fields with additional waits between each field
    await firstNameInput.fill(owner.firstName);
    await this.page.waitForTimeout(500);

    await this.page
      .locator('input[name="lastName"], #lastName')
      .fill(owner.lastName);
    await this.page.waitForTimeout(500);

    await this.page
      .locator('input[name="address"], #address')
      .fill(owner.address);
    await this.page.waitForTimeout(500);

    await this.page.locator('input[name="city"], #city').fill(owner.city);
    await this.page.waitForTimeout(500);

    await this.page
      .locator('input[name="telephone"], #telephone')
      .fill(owner.telephone);
    await this.page.waitForTimeout(500);
  } catch (error) {
    console.error("Error filling owner details:", error);
    await this.page.screenshot({ path: `error-add-owner-${Date.now()}.png` });
    throw error;
  }
});

When("I submit the Add Owner form", async function () {
  await this.addOwnerPage.addOwnerButton().click();
});

Then("I should see the new owner added", async function () {
  const owner = this.lastOwner;
  const fullName = `${owner.firstName} ${owner.lastName}`;
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(owner.address)).toBeVisible();
  await expect(this.page.getByText(owner.city)).toBeVisible();
  await expect(this.page.getByText(owner.telephone)).toBeVisible();
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
    const ownerRows = this.page.locator("table#owners tbody tr");
    const count = await ownerRows.count();
    for (let i = 0; i < count; i++) {
      const row = ownerRows.nth(i);
      const nameLink = row.getByRole("link", { name: fullName });
      const addressCell = row.locator("td").nth(1);
      if (
        (await nameLink.isVisible()) &&
        (await addressCell.textContent())?.trim() === address
      ) {
        await nameLink.click();
        return;
      }
    }
    throw new Error(
      `Owner link for ${fullName} with address ${address} not found.`
    );
  }
);

// New step to click the first owner link when multiple owners exist
When("I click the first owner link {string}", async function (fullName) {
  const firstOwnerLink = this.page.locator(
    `table#owners tbody tr:first-child a:has-text("${fullName}")`
  );
  await firstOwnerLink.click();
});

// Alternative step to click first matching owner by name only
When("I click the first {string} owner link", async function (fullName) {
  const firstOwnerLink = this.page
    .locator(`table#owners tbody tr a:has-text("${fullName}")`)
    .first();
  await firstOwnerLink.click();
});

When("I click the Edit Owner button", async function () {
  const editLink = this.page.getByRole("link", { name: "Edit Owner" });
  await editLink.waitFor({ state: "visible", timeout: 5000 });
  await editLink.click();
});

When("I update owner details:", async function (dataTable) {
  // Use updated owner data from JSON
  const owner = testData.updatedOwner;
  await this.page.waitForTimeout(500);
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});

When("I update to updated owner details", async function () {
  const owner = testData.updatedOwner;
  await this.page.waitForTimeout(500);
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});

When("I submit the Update Owner form", async function () {
  const updateButton = this.page.locator("button.btn.btn-primary", {
    hasText: "Update Owner",
  });
  await updateButton.waitFor({ state: "visible", timeout: 10000 });
  await updateButton.click();
  await this.page.waitForSelector("h2", { state: "visible", timeout: 10000 });
  await this.page.waitForTimeout(2000);
});

Then(
  "I should see the updated owner {string} with address {string}, city {string}, and telephone {string}",
  async function (fullName, address, city, telephone) {
    await expect(this.page.getByText(fullName)).toBeVisible();
    await expect(this.page.getByText(address)).toBeVisible();
    await expect(this.page.getByText(city)).toBeVisible();
    await expect(this.page.getByText(telephone)).toBeVisible();
  }
);

When("I click the Add New Pet button", async function () {
  await this.page.getByRole("link", { name: "Add New Pet" }).click();
});

When("I enter pet details", async function () {
  const pet = testData.newPet;
  await this.page.locator('input[name="name"]').fill(pet.name);
  await this.page.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page
    .locator('select[name="type"]')
    .selectOption({ value: pet.type });
});

// For backward compatibility
When("I enter pet details from json for index {int}", async function (index) {
  const pet = testData.newPet;
  await this.page.locator('input[name="name"]').fill(pet.name);
  await this.page.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page
    .locator('select[name="type"]')
    .selectOption({ value: pet.type });
});

When("I submit the Add Pet form", async function () {
  await this.page.getByRole("button", { name: "Add Pet" }).click();
  await this.page.waitForTimeout(1500);
});

Then(
  "I should see the new pet {string} with birth date {string} and type {string} for owner {string}",
  async function (petName, birthDate, type, ownerName) {
    await expect(this.page.getByText(ownerName)).toBeVisible();
    await expect(this.page.getByText(petName)).toBeVisible();
    await expect(this.page.getByText(birthDate)).toBeVisible();
    await expect(this.page.getByText(type)).toBeVisible();
  }
);

When("I click the pet name link {string}", async function (petName) {
  await this.page.click(`text=${petName}`);
});

When("I click the Add Visit button", async function () {
  await this.page.click('a[href*="visits/new"], button:has-text("Add Visit")');
});

When("I enter visit details", async function () {
  const visit = testData.newVisit;
  await this.page.locator("#description").fill(visit.description);
});

// For backward compatibility
When("I enter visit details from json for index {int}", async function (index) {
  const visit = testData.newVisit;
  await this.page.locator("#description").fill(visit.description);
});

When("I submit the Add Visit form", async function () {
  await this.page.locator("button.btn.btn-primary[type='submit']").click();
  await this.page.waitForLoadState("networkidle");
});
