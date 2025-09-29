import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnerSearchPage } from "../../../src/pages/OwnerSearchPage";

Given("I am on the home page", async function () {
  await this.page!.goto("http://localhost:8081");
});

When("I click the Find Owners icon", async function () {
  await this.page!.getByRole("link", { name: "Find owners" }).click();
});

When("I click the Edit Owner button", async function () {
  await this.page!.getByRole("link", { name: "Edit Owner" }).click();
});

When("I click the Update Owner button", async function () {
  await this.page!.getByRole("button", { name: "Update Owner" }).click();
});

When("I wait a little", async function () {
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

When("I wait a bit longer", async function () {
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

When("I click the Add Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.clickAddOwner();
});

When("I enter {string} in the first name field", async function (firstName) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillFirstName(firstName);
});

When("I enter {string} in the last name field", async function (lastName) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillLastName(lastName);
});

When("I enter {string} in the address field", async function (address) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillAddress(address);
});

When("I enter {string} in the city field", async function (city) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillCity(city);
});

When("I enter {string} in the telephone field", async function (telephone) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillTelephone(telephone);
});

When("I click the Find Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.clickFindOwner();
});

When("I click the Submit Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.clickSubmitOwner();
});

When("I click the first owner link in the results table", async function () {
  await this.page!.locator("#owners tbody tr td a").first().click();
});

Then("I should see the Owner Information header", async function () {
  await expect(
    this.page!.getByRole("heading", { name: /Owner Information/ })
  ).toBeVisible();
});

Then("I should see owner name {string}", async function (ownerName) {
  await expect(this.page!.locator(".ownerFullName")).toHaveText(ownerName);
});

Then("I should see address {string}", async function (address) {
  await expect(this.page!.locator(".ownerAddress")).toHaveText(address);
});

Then("I should see city {string}", async function (city) {
  await expect(this.page!.locator(".ownerCity")).toHaveText(city);
});

Then("I should see telephone {string}", async function (telephone) {
  await expect(this.page!.locator(".ownerTelephone")).toHaveText(telephone);
});

Then(
  "I should see pet {string} with birth date {string} and type {string}",
  async function (pet, birth, type) {
    const petRow = await this.page!.locator(
      `.ownerPets tr:has-text('${pet}')`
    ).first();
    await expect(petRow.locator("td").nth(1)).toHaveText(birth);
    await expect(petRow.locator("td").nth(2)).toHaveText(type);
  }
);
