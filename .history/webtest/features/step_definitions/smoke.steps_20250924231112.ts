import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { HomePage } from "../../../src/pages/HomePage";

Given("I am on the home page", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  await this.homePage.goto();
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

Then("I should see the Find Owners icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  expect(await this.homePage.getFindOwnersNav().isVisible()).toBeTruthy();
});

When("I click the Find Owners icon", async function () {
  if (!this.homePage) this.homePage = new HomePage(this.page!);
  await this.homePage.clickFindOwners();
});

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
