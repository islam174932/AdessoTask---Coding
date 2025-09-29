const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { OwnersPage } = require("../../src/pages/OwnersPage.ts");
const { AddOwnerPage } = require("../../src/pages/AddOwnerPage.ts");
const fs = require("fs");
const path = require("path");
const testDataPath = path.join(__dirname, '../../data/testdata.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

Given("I open the home page", async function () {
  await this.page.goto("http://localhost:8081/");
  this.ownersPage = new OwnersPage(this.page);
  this.homePage = new (require("../../src/pages/HomePage.ts").HomePage)(this.page);
});

When("I click the Find Owners link", async function () {
  await this.ownersPage.findOwnersNav().click();
});

When("I click the Add Owner button", async function () {
  this.addOwnerPage = new AddOwnerPage(this.page);
  await this.page.getByRole("link", { name: "Add Owner" }).click();
});

When("I enter owner details from JSON", async function () {
  const owner = testData.owner;
  this.lastOwner = owner;
  await this.addOwnerPage.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage.addressInput().fill(owner.address);
  await this.addOwnerPage.cityInput().fill(owner.city);
  await this.addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Add Owner form", async function () {
  await this.addOwnerPage.addOwnerButton().click();
});

Then("I should see the new owner added", async function () {
  const owner = this.lastOwner;
  const fullName = `${owner.firstName} ${owner.lastName}`;
  await this.page.waitForTimeout(1000);
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(owner.address)).toBeVisible();
  await expect(this.page.getByText(owner.city)).toBeVisible();
  await expect(this.page.getByText(owner.telephone)).toBeVisible();
});

When("I enter last name {string} in the search field", async function (lastName) {
  await this.ownersPage.lastNameInput().fill(lastName);
});

When("I click the Find Owner button", async function () {
  await this.ownersPage.findOwnerButton().click();
});

Then("I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table", async function (fullName, address, city, telephone) {
  const row = this.ownersPage.getOwnerRowByName(fullName).first();
  await expect(row.getByRole("link", { name: fullName })).toBeVisible();
  await expect(row.getByText(address)).toBeVisible();
  await expect(row.getByText(city)).toBeVisible();
  await expect(row.getByText(telephone)).toBeVisible();
});

When("I click the owner link {string} with address {string}", async function (fullName, address) {
  const ownerRows = this.page.locator("table#owners tbody tr");
  const count = await ownerRows.count();
  for (let i = 0; i < count; i++) {
    const row = ownerRows.nth(i);
    const nameLink = row.getByRole("link", { name: fullName });
    const addressCell = row.locator("td").nth(1);
    if ((await nameLink.isVisible()) && (await addressCell.textContent())?.trim() === address) {
      await nameLink.click();
      return;
    }
  }
  throw new Error(`Owner link for ${fullName} with address ${address} not found.`);
});

When("I click the Edit Owner button", async function () {
  const editLink = this.page.getByRole("link", { name: "Edit Owner" });
  await editLink.waitFor({ state: "visible", timeout: 5000 });
  await editLink.click();
});

When("I update owner details from JSON", async function () {
  const owner = testData.owner;
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
  const updateButton = this.page.locator("button.btn.btn-primary", { hasText: "Update Owner" });
  await updateButton.waitFor({ state: "visible", timeout: 10000 });
  await updateButton.click();
  await this.page.waitForSelector("h2", { state: "visible", timeout: 10000 });
  await this.page.waitForTimeout(2000);
});

Then("I should see the updated owner {string} with address {string}, city {string}, and telephone {string}", async function (fullName, address, city, telephone) {
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(address)).toBeVisible();
  await expect(this.page.getByText(city)).toBeVisible();
  await expect(this.page.getByText(telephone)).toBeVisible();
});

When("I click the Add New Pet button", async function () {
  await this.page.getByRole("link", { name: "Add New Pet" }).click();
});

When("I enter pet details from JSON", async function () {
  const pet = testData.pet;
  await this.page.locator('input[name="name"]').fill(pet.name);
  await this.page.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page.locator('select[name="type"]').selectOption({ value: pet.type });
});

When("I submit the Add Pet form", async function () {
  await this.page.getByRole("button", { name: "Add Pet" }).click();
  await this.page.waitForTimeout(1500);
});

Then("I should see the new pet {string} with birth date {string} and type {string} for owner {string}", async function (petName, birthDate, type, ownerName) {
  await expect(this.page.getByText(ownerName)).toBeVisible();
  await expect(this.page.getByText(petName)).toBeVisible();
  await expect(this.page.getByText(birthDate)).toBeVisible();
  await expect(this.page.getByText(type)).toBeVisible();
});

When("I click the pet name link {string}", async function (petName) {
  const page = this.page;
  await page.click(`text=${petName}`);
});

When("I click the Add Visit button", async function () {
  const page = this.page;
  await page.click('a[href*="visits/new"], button:has-text("Add Visit")');
});

When("I enter visit details from JSON", async function () {
  const visit = testData.visit;
  if (visit.date) {
    await this.page.locator('input[name="date"]').fill(visit.date);
  }
  await this.page.locator('#description').fill(visit.description);
});

When("I submit the Add Visit form", async function () {
  const page = this.page;
  await page.locator("button.btn.btn-primary[type='submit']").click();
  await page.waitForLoadState("networkidle");
});
