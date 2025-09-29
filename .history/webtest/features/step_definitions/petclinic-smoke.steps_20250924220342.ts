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
