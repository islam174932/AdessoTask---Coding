import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given("I am on the home page", async function (this: CustomWorld) {
  await this.page!.goto("http://localhost:8081");
});

When("I click the Find Owners icon", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Find owners" }).click();
});
import { expect } from "@playwright/test";
import { HomePage } from "../../../src/pages/HomePage.ts";

// This file is temporarily renamed by Copilot to avoid ambiguity during regression test runs.

Then("I should see the Find Owners header", async function () {
  expect(
    await this.page!.getByRole("heading", { name: /Find Owners/ }).isVisible()
  ).toBeTruthy();
});

Then("I should see the Veterinarians icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  expect(await this.homePage.getVeterinariansNav().isVisible()).toBeTruthy();
});

When("I click the Veterinarians icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  await this.homePage.clickVeterinarians();
});

Then("I should see the Veterinarians header", async function () {
  expect(
    await this.page!.getByRole("heading", { name: /Veterinarians/ }).isVisible()
  ).toBeTruthy();
});

Then("I should see the Home icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  expect(await this.homePage.getHomeNav().isVisible()).toBeTruthy();
});

When("I click the Home icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  await this.homePage.clickHome();
});

Then("I should see the Welcome header", async function () {
  expect(
    await this.page!.getByRole("heading", { name: /Welcome/ }).isVisible()
  ).toBeTruthy();
});

Then('I should see the Find Owners icon', async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  expect(await this.homePage.getFindOwnersNav().isVisible()).toBeTruthy();
});

When('I wait a little', async function () {
  await new Promise(resolve => setTimeout(resolve, 1000));
});

When('I enter {string} in the last name field', async function (lastName) {
  await this.page.locator('input[name="lastName"]').fill(lastName);
});

When('I click the Find Owner button', async function () {
  await this.page.getByRole('button', { name: /Find Owner/ }).click();
});

When('I click the first owner link in the results table', async function () {
  await this.page.getByRole('link', { name: /.+/ }).first().click();
});

Then('I should see the Owner Information header', async function () {
  expect(await this.page.getByRole('heading', { name: /Owner Information/ }).isVisible()).toBeTruthy();
});

Then('I should see owner name {string}', async function (name) {
  expect(await this.page.getByText(name).isVisible()).toBeTruthy();
});

Then('I should see address {string}', async function (address) {
  expect(await this.page.getByText(address).isVisible()).toBeTruthy();
});

Then('I should see city {string}', async function (city) {
  expect(await this.page.getByText(city).isVisible()).toBeTruthy();
});

Then('I should see telephone {string}', async function (telephone) {
  expect(await this.page.getByText(telephone).isVisible()).toBeTruthy();
});

Then('I should see pet {string} with birth date {string} and type {string}', async function (petName, birthDate, type) {
  expect(await this.page.getByText(petName).isVisible()).toBeTruthy();
  expect(await this.page.getByText(birthDate).isVisible()).toBeTruthy();
  expect(await this.page.getByText(type).isVisible()).toBeTruthy();
});

When('I click the Edit Owner button', async function () {
  await this.page.getByRole('button', { name: /Edit Owner/ }).click();
});

When('I enter {string} in the first name field', async function (firstName) {
  await this.page.getByLabel('First Name').fill(firstName);
});

When('I enter {string} in the address field', async function (address) {
  await this.page.getByLabel('Address').fill(address);
});

When('I click the Update Owner button', async function () {
  await this.page.getByRole('button', { name: /Update Owner/ }).click();
});
