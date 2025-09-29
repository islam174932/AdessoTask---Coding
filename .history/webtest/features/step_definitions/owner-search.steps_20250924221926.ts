import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { OwnerSearchPage } from "../../src/pages/OwnerSearchPage";

When("I wait a little", async function () {
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

When('I enter {string} in the last name field', async function (lastName: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.fillLastName(lastName);
});

When('I click the Find Owner button', async function () {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.clickFindOwner();
});

Then('I should see the Owner Information header', async function () {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getOwnerInfoHeader().isVisible()).toBeTruthy();
});

Then('I should see owner name {string}', async function (name: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getOwnerName().textContent()).toContain(name);
});

Then('I should see address {string}', async function (address: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getAddress().textContent()).toContain(address);
});

Then('I should see city {string}', async function (city: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getCity().textContent()).toContain(city);
});

Then('I should see telephone {string}', async function (tel: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getTelephone().textContent()).toContain(tel);
});

Then('I should see pet {string} with birth date {string} and type {string}', async function (pet: string, birth: string, type: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  const petSection = this.ownerSearchPage.getPetSection(pet);
  expect(await petSection.locator('dd').nth(0).textContent()).toContain(pet);
  expect(await petSection.locator('dd').nth(1).textContent()).toContain(birth);
  expect(await petSection.locator('dd').nth(2).textContent()).toContain(type);
});
