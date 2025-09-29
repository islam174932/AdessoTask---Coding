import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.ts';
import { OwnersPage } from '../../src/pages/OwnersPage.ts';
import { VetsPage } from '../../src/pages/VetsPage.ts';
import { CustomWorld } from '../support/world.ts';

Given('I open the home page', async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page);
  await this.page.goto('http://localhost:8081/');
});

When('I click the Home icon', async function (this: CustomWorld) {
  await this.homePage.clickHome();
});

Then('I should see the Welcome header', async function (this: CustomWorld) {
  expect(await this.homePage.isWelcomeVisible()).toBeTruthy();
});

// Add homePage property to CustomWorld
declare module '../support/world.ts' {
  interface CustomWorld {
    homePage: HomePage;
    ownersPage: OwnersPage;
    vetsPage: VetsPage;
  }
}

When('I click the Find Owners link', async function (this: CustomWorld) {
  this.ownersPage = new OwnersPage(this.page);
  await this.ownersPage.findOwnersNav().click();
});

When('I enter {string} in the last name field', async function (this: CustomWorld, lastName: string) {
  await this.ownersPage.lastNameInput().fill(lastName);
});

When('I click the Find Owner button', async function (this: CustomWorld) {
  await this.ownersPage.findOwnerButton().click();
});

Then('I should see the Owners table with correct Davis entries', async function (this: CustomWorld) {
  await this.ownersPage.validateDavisOwners();
});

When('I click the Veterinarians link', async function (this: CustomWorld) {
  this.vetsPage = new VetsPage(this.page);
  await this.vetsPage.vetsNav().click();
});

Then('I should see the Veterinarians table with correct data', async function (this: CustomWorld) {
  await this.vetsPage.validateVetsTable();
});

Then('I should be able to click the Next page link', async function (this: CustomWorld) {
  await this.vetsPage.clickNextPage();
});
