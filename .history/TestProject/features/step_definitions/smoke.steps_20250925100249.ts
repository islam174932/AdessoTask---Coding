import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.ts';
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
  }
}
