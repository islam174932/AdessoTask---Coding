import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I open the home page', async function () {
  await this.page.goto('http://localhost:8081');
});

Then('I should see the Welcome header', async function () {
  expect(await this.page.getByRole('heading', { name: /Welcome/ }).isVisible()).toBeTruthy();
});
