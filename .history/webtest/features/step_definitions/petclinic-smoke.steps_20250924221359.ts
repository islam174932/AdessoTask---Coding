import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { HomePage } from "../../src/pages/HomePage";

Given("I am on the home page", async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  await this.homePage.goto();
});

Then("I should see the Home icon", async function (this: CustomWorld) {
  expect(await this.homePage!.getHomeNav().isVisible()).toBeTruthy();
});

When("I click the Home icon", async function (this: CustomWorld) {
  await this.homePage!.clickHome();
});

Then("I should see the Welcome header", async function (this: CustomWorld) {
  expect(await this.page!.isVisible("h2")).toBeTruthy();
  const headerText = await this.page!.textContent("h2");
  expect(headerText).toContain("Welcome");
});

Then("I should see the Find Owners icon", async function (this: CustomWorld) {
  expect(await this.homePage!.getFindOwnersNav().isVisible()).toBeTruthy();
});

When("I click the Find Owners icon", async function (this: CustomWorld) {
  await this.homePage!.clickFindOwners();
});

Then("I should see the Find Owners header", async function (this: CustomWorld) {
  expect(await this.page!.isVisible("h2")).toBeTruthy();
  const headerText = await this.page!.textContent("h2");
  expect(headerText).toContain("Find Owners");
});

Then("I should see the Veterinarians icon", async function (this: CustomWorld) {
  expect(await this.homePage!.getVeterinariansNav().isVisible()).toBeTruthy();
});

When("I click the Veterinarians icon", async function (this: CustomWorld) {
  await this.homePage!.clickVeterinarians();
});

Then(
  "I should see the Veterinarians header",
  async function (this: CustomWorld) {
    const vetHeader = this.page!.getByRole("heading", { name: /Veterinarians/ });
    expect(await vetHeader.isVisible()).toBeTruthy();
  }
);
