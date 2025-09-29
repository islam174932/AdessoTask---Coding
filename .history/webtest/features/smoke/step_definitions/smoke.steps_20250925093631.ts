import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given("I am on the home page", async function (this: CustomWorld) {
  await this.page!.goto("http://localhost:8081");
});

When("I click the Find Owners icon", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Find owners" }).click();
});
import { expect } from "@playwright/test";
import { HomePage } from "../../../src/pages/HomePage";

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
