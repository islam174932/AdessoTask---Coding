import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnerSearchPage } from "../../src/pages/OwnerSearchPage";

When('I click the Add Owner button', async function () {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.click('a.btn.btn-primary[href="/owners/new"]');
});

When('I enter {string} in the first name field', async function (firstName: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill('#firstName', firstName);
});

When('I enter {string} in the last name field', async function (lastName: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill('#lastName', lastName);
});

When('I enter {string} in the address field', async function (address: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill('#address', address);
});

When('I enter {string} in the city field', async function (city: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill('#city', city);
});

When('I enter {string} in the telephone field', async function (telephone: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill('#telephone', telephone);
});

When('I click the Submit Owner button', async function () {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.click('button[type="submit"].btn.btn-primary');
});

Then('I should see owner name "{string} {string}"', async function (firstName: string, lastName: string) {
  if (!this.ownerSearchPage) this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getOwnerName().textContent()).toContain(`${firstName} ${lastName}`);
});
