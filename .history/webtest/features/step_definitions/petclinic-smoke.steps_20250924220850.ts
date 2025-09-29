import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { HomePage } from "../../src/pages/HomePage";

Given("I am on the home page", async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  await this.homePage.goto();
});

Then("I should see the Home icon", async function (this: CustomWorld) {
  // Home icon: <a class="nav-link active" href="/" title="home page"><span class="fa fa-home"></span><span>Home</span></a>
  const homeIconSelector = 'a.nav-link.active[title="home page"] span.fa-home';
  expect(await this.page!.isVisible(homeIconSelector)).toBeTruthy();
});

When("I click the Home icon", async function (this: CustomWorld) {
  const homeIconLinkSelector = 'a.nav-link.active[title="home page"]';
  await this.page!.click(homeIconLinkSelector);
});

Then("I should see the Welcome header", async function (this: CustomWorld) {
  expect(await this.page!.isVisible("h2")).toBeTruthy();
  const headerText = await this.page!.textContent("h2");
  expect(headerText).toContain("Welcome");
});

Then("I should see the Find Owners icon", async function (this: CustomWorld) {
  // Find Owners icon: <a class="nav-link" href="/owners/find" title="find owners page"><span class="fa fa-search"></span><span>Find Owners</span></a>
  const findOwnersSelector = 'a.nav-link[href="/owners/find"] span:has-text("Find Owners")';
  expect(await this.page!.isVisible(findOwnersSelector)).toBeTruthy();
});

When("I click the Find Owners icon", async function (this: CustomWorld) {
  const findOwnersLinkSelector = 'a.nav-link[href="/owners/find"]';
  await this.page!.click(findOwnersLinkSelector);
});

Then("I should see the Find Owners header", async function (this: CustomWorld) {
  expect(await this.page!.isVisible("h2")).toBeTruthy();
  const headerText = await this.page!.textContent("h2");
  expect(headerText).toContain("Find Owners");
});

Then("I should see the Veterinarians icon", async function (this: CustomWorld) {
  // Veterinarians icon: <a class="nav-link" href="/vets" title="veterinarians page"><span class="fa fa-user-md"></span><span>Veterinarians</span></a>
  const vetsSelector = 'a.nav-link[href="/vets"] span:has-text("Veterinarians")';
  expect(await this.page!.isVisible(vetsSelector)).toBeTruthy();
});

When("I click the Veterinarians icon", async function (this: CustomWorld) {
  const vetsLinkSelector = 'a.nav-link[href="/vets"]';
  await this.page!.click(vetsLinkSelector);
});

Then("I should see the Veterinarians header", async function (this: CustomWorld) {
  expect(await this.page!.isVisible("h2")).toBeTruthy();
  const headerText = await this.page!.textContent("h2");
  expect(headerText).toContain("Veterinarians");
});
