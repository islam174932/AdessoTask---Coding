import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

When("I wait a little", async function () {
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

When('I enter {string} in the last name field', async function (lastName: string) {
  await this.page!.fill('input#lastName', lastName);
});

When('I click the Find Owner button', async function () {
  await this.page!.click('button[type="submit"].btn.btn-primary');
});

Then('I should see the Owner Information header', async function () {
  const header = this.page!.getByRole('heading', { name: /Owner Information/ });
  expect(await header.isVisible()).toBeTruthy();
});

Then('I should see owner name {string}', async function (name: string) {
  expect(await this.page!.locator('td b').first().textContent()).toContain(name);
});

Then('I should see address {string}', async function (address: string) {
  expect(await this.page!.locator('tr:has(th:text("Address")) td').textContent()).toContain(address);
});

Then('I should see city {string}', async function (city: string) {
  expect(await this.page!.locator('tr:has(th:text("City")) td').textContent()).toContain(city);
});

Then('I should see telephone {string}', async function (tel: string) {
  expect(await this.page!.locator('tr:has(th:text("Telephone")) td').textContent()).toContain(tel);
});

Then('I should see pet {string} with birth date {string} and type {string}', async function (pet: string, birth: string, type: string) {
  const petSection = this.page!.locator('dl.dl-horizontal').filter({ hasText: pet });
  expect(await petSection.locator('dd').nth(0).textContent()).toContain(pet);
  expect(await petSection.locator('dd').nth(1).textContent()).toContain(birth);
  expect(await petSection.locator('dd').nth(2).textContent()).toContain(type);
});
