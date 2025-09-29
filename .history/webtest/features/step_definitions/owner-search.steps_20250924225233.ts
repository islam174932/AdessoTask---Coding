import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnerSearchPage } from "../../src/pages/OwnerSearchPage";


// Step to click the first owner link in the search results table if present
When("I click the first owner link in the results table", async function () {
  // Wait for either the Owner Information header or the owners table
  const header = this.page!.getByRole("heading", { name: /Owner Information/ });
  const table = this.page!.locator("#owners");
  if (await header.isVisible()) {
    // Already on the details page
    return;
  }
  // Wait for the table to appear
  await table.waitFor({ state: "visible", timeout: 5000 });
  // Click the first owner link in the table
  const firstLink = table.locator("tbody tr td a").first();
  await firstLink.click();
});


When("I wait a little", async function () {
  await new Promise((resolve) => setTimeout(resolve, 1200));
});

When("I wait a bit longer", async function () {
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

When("I click the Add Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.click('a.btn.btn-primary[href="/owners/new"]');
});

When(
  "I enter {string} in the first name field",
  async function (firstName: string) {
    if (!this.ownerSearchPage)
      this.ownerSearchPage = new OwnerSearchPage(this.page!);
    await this.page!.fill("#firstName", firstName);
  }
);

When(
  "I enter {string} in the last name field",
  async function (lastName: string) {
    if (!this.ownerSearchPage)
      this.ownerSearchPage = new OwnerSearchPage(this.page!);
    await this.page!.fill("#lastName", lastName);
  }
);

When("I enter {string} in the address field", async function (address: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill("#address", address);
});

When("I enter {string} in the city field", async function (city: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.fill("#city", city);
});

When(
  "I enter {string} in the telephone field",
  async function (telephone: string) {
    if (!this.ownerSearchPage)
      this.ownerSearchPage = new OwnerSearchPage(this.page!);
    await this.page!.fill("#telephone", telephone);
  }
);

When("I click the Find Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.ownerSearchPage.clickFindOwner();
});

When("I click the Submit Owner button", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  await this.page!.click('button[type="submit"].btn.btn-primary');
});

Then("I should see the Owner Information header", async function () {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(
    await this.ownerSearchPage.getOwnerInfoHeader().isVisible()
  ).toBeTruthy();
});

Then("I should see owner name {string}", async function (name: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getOwnerName().textContent()).toContain(
    name
  );
});

Then(
  'I should see owner name "{string} {string}"',
  async function (firstName: string, lastName: string) {
    if (!this.ownerSearchPage)
      this.ownerSearchPage = new OwnerSearchPage(this.page!);
    expect(await this.ownerSearchPage.getOwnerName().textContent()).toContain(
      `${firstName} ${lastName}`
    );
  }
);

Then("I should see address {string}", async function (address: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getAddress().textContent()).toContain(
    address
  );
});

Then("I should see city {string}", async function (city: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getCity().textContent()).toContain(city);
});

Then("I should see telephone {string}", async function (tel: string) {
  if (!this.ownerSearchPage)
    this.ownerSearchPage = new OwnerSearchPage(this.page!);
  expect(await this.ownerSearchPage.getTelephone().textContent()).toContain(
    tel
  );
});

Then(
  "I should see pet {string} with birth date {string} and type {string}",
  async function (pet: string, birth: string, type: string) {
    if (!this.ownerSearchPage)
      this.ownerSearchPage = new OwnerSearchPage(this.page!);
    const petSection = this.ownerSearchPage.getPetSection(pet);
    expect(await petSection.locator("dd").nth(0).textContent()).toContain(pet);
    expect(await petSection.locator("dd").nth(1).textContent()).toContain(
      birth
    );
    expect(await petSection.locator("dd").nth(2).textContent()).toContain(type);
  }
);
