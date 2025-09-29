import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { HomePage } from "../../../src/pages/HomePage";

// ...existing code...


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
