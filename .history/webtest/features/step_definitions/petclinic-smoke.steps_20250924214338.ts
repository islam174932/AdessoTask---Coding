import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { HomePage } from '../../src/pages/HomePage';


Given('I am on the home page', async function (this: CustomWorld) {
  this.homePage = new HomePage(this.page!);
  await this.homePage.goto();
});


Then('I should see the PetClinic logo', async function (this: CustomWorld) {
  expect(await this.homePage!.isLogoVisible()).toBeTruthy();
});


Then('I should see the Home navigation link', async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.homeNavSelector)).toBeTruthy();
});


When('I click the Home navigation link', async function (this: CustomWorld) {
  await this.homePage!.clickHome();
});


Then('I should be on the home page', async function (this: CustomWorld) {
  expect(this.page!.url()).toBe('http://localhost:8081/');
});


Then('I should see the Find Owners navigation link', async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.findOwnersNavSelector)).toBeTruthy();
});


When('I click the Find Owners navigation link', async function (this: CustomWorld) {
  await this.homePage!.clickFindOwners();
});


Then('I should be on the Find Owners page', async function (this: CustomWorld) {
  expect(this.page!.url()).toContain('/owners/find');
});


Then('I should see the Veterinarians navigation link', async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.veterinariansNavSelector)).toBeTruthy();
});


When('I click the Veterinarians navigation link', async function (this: CustomWorld) {
  await this.homePage!.clickVeterinarians();
});


Then('I should be on the Veterinarians page', async function (this: CustomWorld) {
  expect(this.page!.url()).toContain('/vets');
});


Then('I should see the Error navigation link', async function (this: CustomWorld) {
  expect(await this.page!.isVisible(this.homePage!.errorNavSelector)).toBeTruthy();
});


When('I click the Error navigation link', async function (this: CustomWorld) {
  await this.homePage!.clickError();
});


Then('I should be on the Error page', async function (this: CustomWorld) {
  expect(this.page!.url()).toContain('/oups');
});
