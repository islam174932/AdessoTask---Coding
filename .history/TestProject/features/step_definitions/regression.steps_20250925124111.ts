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
  await this.page.waitForTimeout(500); // Wait for page to stabilize
  const fields = [
    { name: 'firstName', value: owner.firstName },
    { name: 'lastName', value: owner.lastName },
    { name: 'address', value: owner.address },
    { name: 'city', value: owner.city },
    { name: 'telephone', value: owner.telephone }
  ];
  for (const field of fields) {
    const input = this.page.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(field.value);
  }
});

When('I submit the Update Owner form', async function (this: CustomWorld) {
  const updateButton = this.page.locator('button.btn.btn-primary', { hasText: 'Update Owner' });
  await updateButton.waitFor({ state: 'visible', timeout: 10000 });
  await updateButton.click();
  // Wait for navigation to owner details page after update
  await this.page.waitForSelector('h2', { state: 'visible', timeout: 10000 });
  await this.page.waitForTimeout(2000); // Extra wait for page to stabilize
});

Then('I should see the updated owner {string} with address {string}, city {string}, and telephone {string}', async function (this: CustomWorld, fullName: string, address: string, city: string, telephone: string) {
  await expect(this.page.getByText(fullName)).toBeVisible();
  await expect(this.page.getByText(address)).toBeVisible();
  await expect(this.page.getByText(city)).toBeVisible();
  await expect(this.page.getByText(telephone)).toBeVisible();
});

When('I click the Add New Pet button', async function (this: CustomWorld) {
  await this.page.getByRole('link', { name: 'Add New Pet' }).click();
});

When('I enter pet details:', async function (this: CustomWorld, dataTable) {
  const pet = dataTable.hashes()[0];
  await this.page.locator('input[name="name"]').fill(pet.name);
  await this.page.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page.locator('select[name="type"]').selectOption({ value: pet.type });
});

When('I submit the Add Pet form', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Add Pet' }).click();
  await this.page.waitForTimeout(1500); // Wait for page to update
});

Then('I should see the new pet {string} with birth date {string} and type {string} for owner {string}', async function (this: CustomWorld, petName, birthDate, type, ownerName) {
  // Validate pet appears in owner's pet list
  await expect(this.page.getByText(ownerName)).toBeVisible();
  await expect(this.page.getByText(petName)).toBeVisible();
  await expect(this.page.getByText(birthDate)).toBeVisible();
  await expect(this.page.getByText(type)).toBeVisible();
});

When('I click the pet name link {string}', async function (petName) {
  const page = this.page;
  // Find the pet link by name in the owner's details page
  await page.click(`text=${petName}`);
});

When('I click the Add Visit button', async function () {
  const page = this.page;
  // Find and click the Add Visit button (link or button)
  await page.click('a[href*="visits/new"], button:has-text("Add Visit")');
});

When('I enter visit details:', async function (dataTable) {
  const page = this.page;
  const data = dataTable.rowsHash();
  // Force fill the description field
  const descInput = await page.locator('input[type="text"][name="description"]');
  await descInput.fill(''); // Clear field first
  if (data.description) {
    await descInput.type(data.description); // Type the description value
  }
});

When('I submit the Add Visit form', async function () {
  const page = this.page;
  await page.click('button[type="submit"]:has-text("Add Visit")');
  // Wait longer for Previous Visits table to update
  await page.waitForTimeout(3000);
  await page.waitForSelector('text=Previous Visits', { timeout: 15000 });
});

Then('I should see the new visit with date {string} and description {string} for pet {string}', async function (date, description, petName) {
  const page = this.page;
  // Wait for Previous Visits table to appear
  await page.waitForSelector('text=Previous Visits', { timeout: 10000 });
  // Select the Previous Visits table by its heading and class
  const visitsTable = page.locator('b:has-text("Previous Visits") + table.table-striped');
  const rows = await visitsTable.locator('tbody tr').all();
  let found = false;
  for (const row of rows) {
    const cells = await row.locator('td').allTextContents();
    if (cells.length >= 2 && cells[0].includes(date) && cells[1].includes(description)) {
      found = true;
      break;
    }
  }
  if (!found) {
    // Print table contents for debugging
    const tableText = await visitsTable.textContent();
    throw new Error(`Visit with date ${date} and description ${description} not found for pet ${petName}. Table contents: ${tableText}`);
  }
});

// Add POM properties to CustomWorld
declare module '../support/world.ts' {
  interface CustomWorld {
    ownersPage: OwnersPage;
    addOwnerPage: AddOwnerPage;
  }
}
