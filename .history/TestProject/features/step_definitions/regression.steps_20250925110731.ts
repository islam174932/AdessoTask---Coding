import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { OwnersPage } from '../../src/pages/OwnersPage.ts';
import { AddOwnerPage } from '../../src/pages/AddOwnerPage.ts';
import { CustomWorld } from '../support/world.ts';

Given('I open the home page', async function (this: CustomWorld) {
  await this.page.goto('http://localhost:8081/');
  this.ownersPage = new OwnersPage(this.page);
});

When('I click the Find Owners link', async function (this: CustomWorld) {
  await this.ownersPage.findOwnersNav().click();
});

When('I click the Add Owner button', async function (this: CustomWorld) {
  this.addOwnerPage = new AddOwnerPage(this.page);
  await this.page.getByRole('link', { name: 'Add Owner' }).click();
});

When('I enter owner details:', async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  this.lastOwner = owner; // Store for later validation
  await this.addOwnerPage.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage.addressInput().fill(owner.address);
  await this.addOwnerPage.cityInput().fill(owner.city);
  await this.addOwnerPage.telephoneInput().fill(owner.telephone);
});

When('I submit the Add Owner form', async function (this: CustomWorld) {
  await this.addOwnerPage.addOwnerButton().click();
});

Then('I should see the new owner added', async function (this: CustomWorld) {
  // Validate new owner appears on the resulting page
  const owner = this.lastOwner;
  const fullName = `${owner.firstName} ${owner.lastName}`;
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(owner.address)).toBeVisible();
  await expect(this.page.getByText(owner.city)).toBeVisible();
  await expect(this.page.getByText(owner.telephone)).toBeVisible();
});

// Add POM properties to CustomWorld
declare module '../support/world.ts' {
  interface CustomWorld {
    ownersPage: OwnersPage;
    addOwnerPage: AddOwnerPage;
  }
}
