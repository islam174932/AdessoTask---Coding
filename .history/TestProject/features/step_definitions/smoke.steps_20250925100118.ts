import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage.ts';

Given('I open the home page', async function () {
  this.homePage = new HomePage(this.page);
  await this.homePage.page.goto('http://localhost:8081/');
});

When('I click the Home icon', async function () {
  await this.homePage.clickHome();
});

Then('I should see the Welcome header', async function () {
  expect(await this.homePage.isWelcomeVisible()).toBeTruthy();
});
