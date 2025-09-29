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

When('I enter last name {string} in the search field', async function (this: CustomWorld, lastName: string) {
  await this.ownersPage.lastNameInput().fill(lastName);
});

When('I click the Find Owner button', async function (this: CustomWorld) {
  await this.ownersPage.findOwnerButton().click();
});

Then('I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table', async function (this: CustomWorld, fullName: string, address: string, city: string, telephone: string) {
  const row = this.ownersPage.getOwnerRowByName(fullName).first();
  await expect(row.getByRole('link', { name: fullName })).toBeVisible();
  await expect(row.getByText(address)).toBeVisible();
  await expect(row.getByText(city)).toBeVisible();
  await expect(row.getByText(telephone)).toBeVisible();
});

When('I click the owner link {string} with address {string}', async function (this: CustomWorld, fullName: string, address: string) {
  const ownerRows = this.page.locator('table#owners tbody tr');
  const count = await ownerRows.count();
  for (let i = 0; i < count; i++) {
    const row = ownerRows.nth(i);
    const nameLink = row.getByRole('link', { name: fullName });
    const addressCell = row.locator('td').nth(1);
    if (await nameLink.isVisible() && (await addressCell.textContent())?.trim() === address) {
      await nameLink.click();
      return;
    }
  }
  throw new Error(`Owner link for ${fullName} with address ${address} not found.`);
});

When('I click the Edit Owner button', async function (this: CustomWorld) {
  const editLink = this.page.getByRole('link', { name: 'Edit Owner' });
  await editLink.waitFor({ state: 'visible', timeout: 5000 });
  await editLink.click();
});

When('I update owner details:', async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  await this.page.locator('input[name="firstName"]').clear();
  await this.page.locator('input[name="lastName"]').clear();
  await this.page.locator('input[name="address"]').clear();
  await this.page.locator('input[name="city"]').clear();
  await this.page.locator('input[name="telephone"]').clear();
  await this.page.locator('input[name="firstName"]').fill(owner.firstName);
  await this.page.locator('input[name="lastName"]').fill(owner.lastName);
  await this.page.locator('input[name="address"]').fill(owner.address);
  await this.page.locator('input[name="city"]').fill(owner.city);
  await this.page.locator('input[name="telephone"]').fill(owner.telephone);
});

When('I submit the Update Owner form', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Update Owner' }).click();
});

Then('I should see the updated owner {string} with address {string}, city {string}, and telephone {string}', async function (this: CustomWorld, fullName: string, address: string, city: string, telephone: string) {
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(address)).toBeVisible();
  await expect(this.page.getByText(city)).toBeVisible();
  await expect(this.page.getByText(telephone)).toBeVisible();
});

// Add POM properties to CustomWorld
declare module '../support/world.ts' {
  interface CustomWorld {
    ownersPage: OwnersPage;
    addOwnerPage: AddOwnerPage;
  }
}
