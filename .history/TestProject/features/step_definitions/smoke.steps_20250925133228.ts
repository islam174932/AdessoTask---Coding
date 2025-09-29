import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.ts';
import { OwnersPage } from '../../src/pages/OwnersPage.ts';
import { VetsPage } from '../../src/pages/VetsPage.ts';
import { ErrorPage } from '../../src/pages/ErrorPage.ts';
import { CustomWorld } from '../support/world.ts';

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
    errorPage: ErrorPage;
  }
}


When('I enter {string} in the last name field', async function (this: CustomWorld, lastName: string) {
  await this.ownersPage.lastNameInput().fill(lastName);
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

When('I click the Error link', async function (this: CustomWorld) {
  this.errorPage = new ErrorPage(this.page);
  await this.errorPage.clickErrorNav();
});

Then('I should see the Something happened header', async function (this: CustomWorld) {
  expect(await this.errorPage.isErrorHeaderVisible()).toBeTruthy();
});
