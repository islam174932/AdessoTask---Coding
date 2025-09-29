import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { HomePage } from "../../src/pages/HomePage";

Given("I am on the home page", async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  await this.homePage.goto();
});

Then("I should see the PetClinic logo", async function (this: CustomWorld) {
  expect(await this.homePage!.isLogoVisible()).toBeTruthy();
});


Then("I should see and click the Home navigation link", async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.homeNavSelector)).toBeTruthy();
  await this.homePage!.clickHome();
  await this.page!.waitForURL("http://localhost:8081/");
  expect(this.page!.url()).toBe("http://localhost:8081/");
});


Then("I should see and click the Find Owners navigation link", async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.findOwnersNavSelector)).toBeTruthy();
  await this.homePage!.clickFindOwners();
  await this.page!.waitForURL("**/owners/find");
  expect(this.page!.url()).toContain("/owners/find");
});


Then("I should see and click the Veterinarians navigation link", async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.veterinariansNavSelector)).toBeTruthy();
  await this.homePage!.clickVeterinarians();
  await this.page!.waitForURL("**/vets");
  expect(this.page!.url()).toContain("/vets");
});


Then("I should see and click the Error navigation link", async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.errorNavSelector)).toBeTruthy();
  await this.homePage!.clickError();
  await this.page!.waitForURL("**/oups");
  expect(this.page!.url()).toContain("/oups");
});
