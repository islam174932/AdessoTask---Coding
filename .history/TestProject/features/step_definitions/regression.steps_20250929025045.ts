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
  await this.page.locator('form#add-owner-form').waitFor({ state: "visible", timeout: 10000 });
  await this.page.screenshot({ path: 'add-owner-form-debug.png', fullPage: true });
});

When("I enter owner details from json for index {int}", async function (index) {
  const owners = await loadJson("../../test-data/owners.json");
  const owner = owners[index];
  if (!owner) throw new Error(`No owner data found for index ${index}`);
  this.lastOwner = owner;
  const fields = [
    this.addOwnerPage.firstNameInput(),
    this.addOwnerPage.lastNameInput(),
    this.addOwnerPage.addressInput(),
    this.addOwnerPage.cityInput(),
    this.addOwnerPage.telephoneInput()
  ];
  for (const field of fields) {
    await field.waitFor({ state: "visible", timeout: 10000 });
    await field.scrollIntoViewIfNeeded();
  }
  await this.addOwnerPage.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage.addressInput().fill(owner.address);
  await this.addOwnerPage.cityInput().fill(owner.city);
  await this.addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Add Owner form", async function () {
  const submitBtn = this.addOwnerPage.addOwnerSubmitButton();
  await submitBtn.waitFor({ state: "visible", timeout: 10000 });
  await submitBtn.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(40000);
  await submitBtn.click();
});

Then("I should see the new owner added", async function () {
  const owner = this.lastOwner;
  const fullName = `${owner.firstName} ${owner.lastName}`;
  const ownersTable = this.page.locator('table#owners');
  await ownersTable.waitFor({ state: "visible", timeout: 10000 });
  await ownersTable.scrollIntoViewIfNeeded();
  const row = this.ownersPage.getOwnerRowByName(fullName).first();
  await expect(row.getByRole("link", { name: fullName })).toBeVisible();
  await expect(row.getByText(owner.address)).toBeVisible();
  await expect(row.getByText(owner.city)).toBeVisible();
  await expect(row.getByText(owner.telephone)).toBeVisible();
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

When("I update owner details:", async function (dataTable) {
  const owner = dataTable.hashes()[0];
  await this.addOwnerPage.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage.addressInput().fill(owner.address);
  await this.addOwnerPage.cityInput().fill(owner.city);
  await this.addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Update Owner form", async function () {
  await this.addOwnerPage.addOwnerButton().click();
  await this.page.waitForSelector("h2", { state: "visible", timeout: 10000 });
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
  const pets = await loadJson("../../test-data/pets.json");
  const pet = pets[index];
  if (!pet) throw new Error(`No pet data found for index ${index}`);
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
  const visits = await loadJson("../../test-data/visits.json");
  const visit = visits[index];
  if (!visit) throw new Error(`No visit data found for index ${index}`);
  await this.visitPage.descriptionInput().fill(visit.description);
});

When("I submit the Add Visit form", async function () {
  await this.visitPage.submitButton().click();
  await this.page.waitForLoadState("networkidle");
});
