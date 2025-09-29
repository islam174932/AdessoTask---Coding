import { Page } from "playwright";

// Robust input filler for flaky fields
async function fillInput(page: Page, selector: string, text: string) {
  await page.waitForSelector(selector, { state: "visible", timeout: 10000 });
  try {
    await page.fill(selector, text);
    const value = await page.inputValue(selector);
    if (value === text) {
      // Fire input/change events to trigger any listeners
      await page.evaluate(
        ({ selector, value }) => {
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLInputElement).value = value;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        },
        { selector, value: text }
      );
      return;
    }
  } catch {}
  await page.click(selector);
  await page.keyboard.press("Control+A");
  await page.keyboard.type(text, { delay: 100 });
  // Fire input/change events after typing
  await page.evaluate(
    ({ selector, value }) => {
      const el = document.querySelector(selector);
      if (el) {
        (el as HTMLInputElement).value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    { selector, value: text }
  );
}
// ...existing code...
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { OwnersPage } from "../../src/pages/OwnersPage.ts";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage.ts";
import { CustomWorld } from "../support/world.ts";

Given("I open the home page", async function (this: CustomWorld) {
  await this.page!.goto("http://localhost:8081/");
  this.ownersPage = new OwnersPage(this.page!);
  this.homePage = new (await import("../../src/pages/HomePage.ts")).HomePage(
    this.page!
  );
});

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.ownersPage!.findOwnersNav().click();
});

When("I click the Add Owner button", async function (this: CustomWorld) {
  this.addOwnerPage = new AddOwnerPage(this.page!);
  await this.page!.getByRole("link", { name: "Add Owner" }).click();
});

When("I enter owner details:", async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  this.lastOwner = owner; // Store for later validation
  await this.addOwnerPage!.firstNameInput().fill(owner.firstName);
  await this.addOwnerPage!.lastNameInput().fill(owner.lastName);
  await this.addOwnerPage!.addressInput().fill(owner.address);
  await this.addOwnerPage!.cityInput().fill(owner.city);
  await this.addOwnerPage!.telephoneInput().fill(owner.telephone);
});

When("I submit the Add Owner form", async function (this: CustomWorld) {
  await this.addOwnerPage!.addOwnerButton().click();
});

Then("I should see the new owner added", async function (this: CustomWorld) {
  // Validate new owner appears on the resulting page
  const owner = this.lastOwner;
  const fullName = `${owner.firstName} ${owner.lastName}`;
  await expect(this.page!.getByText(fullName)).toBeVisible();
  await expect(this.page!.getByText(owner.address)).toBeVisible();
  await expect(this.page!.getByText(owner.city)).toBeVisible();
  await expect(this.page!.getByText(owner.telephone)).toBeVisible();
});

When(
  "I enter last name {string} in the search field",
  async function (this: CustomWorld, lastName: string) {
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  await this.ownersPage!.findOwnerButton().click();
});

Then(
  "I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table",
  async function (
    this: CustomWorld,
    fullName: string,
    address: string,
    city: string,
    telephone: string
  ) {
    const row = this.ownersPage!.getOwnerRowByName(fullName).first();
    await expect(row.getByRole("link", { name: fullName })).toBeVisible();
    await expect(row.getByText(address)).toBeVisible();
    await expect(row.getByText(city)).toBeVisible();
    await expect(row.getByText(telephone)).toBeVisible();
  }
);

When(
  "I click the owner link {string} with address {string}",
  async function (this: CustomWorld, fullName: string, address: string) {
    const ownerRows = this.page!.locator("table#owners tbody tr");
    const count = await ownerRows.count();
    for (let i = 0; i < count; i++) {
      const row = ownerRows.nth(i);
      const nameLink = row.getByRole("link", { name: fullName });
      const addressCell = row.locator("td").nth(1);
      if (
        (await nameLink.isVisible()) &&
        (await addressCell.textContent())?.trim() === address
      ) {
        await nameLink.click();
        return;
      }
    }
    throw new Error(
      `Owner link for ${fullName} with address ${address} not found.`
    );
  }
);

When("I click the Edit Owner button", async function (this: CustomWorld) {
  const editLink = this.page!.getByRole("link", { name: "Edit Owner" });
  await editLink.waitFor({ state: "visible", timeout: 5000 });
  await editLink.click();
});

When("I update owner details:", async function (this: CustomWorld, dataTable) {
  const owner = dataTable.hashes()[0];
  await this.page!.waitForTimeout(500); // Wait for page to stabilize
  const fields = [
    { name: "firstName", value: owner.firstName },
    { name: "lastName", value: owner.lastName },
    { name: "address", value: owner.address },
    { name: "city", value: owner.city },
    { name: "telephone", value: owner.telephone },
  ];
  for (const field of fields) {
    const input = this.page!.locator(`input[name="${field.name}"]`);
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(field.value);
  }
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  const updateButton = this.page!.locator("button.btn.btn-primary", {
    hasText: "Update Owner",
  });
  await updateButton.waitFor({ state: "visible", timeout: 10000 });
  await updateButton.click();
  // Wait for navigation to owner details page after update
  await this.page!.waitForSelector("h2", { state: "visible", timeout: 10000 });
  await this.page!.waitForTimeout(2000); // Extra wait for page to stabilize
});

Then(
  "I should see the updated owner {string} with address {string}, city {string}, and telephone {string}",
  async function (
    this: CustomWorld,
    fullName: string,
    address: string,
    city: string,
    telephone: string
  ) {
    await expect(this.page!.getByText(fullName)).toBeVisible();
    await expect(this.page!.getByText(address)).toBeVisible();
    await expect(this.page!.getByText(city)).toBeVisible();
    await expect(this.page!.getByText(telephone)).toBeVisible();
  }
);

When("I click the Add New Pet button", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Add New Pet" }).click();
});

When("I enter pet details:", async function (this: CustomWorld, dataTable) {
  const pet = dataTable.hashes()[0];
  await this.page!.locator('input[name="name"]').fill(pet.name);
  await this.page!.locator('input[name="birthDate"]').fill(pet.birthDate);
  await this.page!.locator('select[name="type"]').selectOption({
    value: pet.type,
  });
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.page!.getByRole("button", { name: "Add Pet" }).click();
  await this.page!.waitForTimeout(1500); // Wait for page to update
});

Then(
  "I should see the new pet {string} with birth date {string} and type {string} for owner {string}",
  async function (this: CustomWorld, petName, birthDate, type, ownerName) {
    // Validate pet appears in owner's pet list
    await expect(this.page!.getByText(ownerName)).toBeVisible();
    await expect(this.page!.getByText(petName)).toBeVisible();
    await expect(this.page!.getByText(birthDate)).toBeVisible();
    await expect(this.page!.getByText(type)).toBeVisible();
  }
);

When("I click the pet name link {string}", async function (petName) {
  const page = this.page!;
  // Find the pet link by name in the owner's details page
  await page.click(`text=${petName}`);
});

When("I click the Add Visit button", async function () {
  const page = this.page!;
  // Find and click the Add Visit button (link or button)
  await page.click('a[href*="visits/new"], button:has-text("Add Visit")');
});

// ...existing code...

When("I enter visit details:", async function (dataTable) {
  const page = this.page!;
  const data = dataTable.rowsHash();

  // Wait for form to be completely loaded
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Wait for form elements to be ready
  await page.waitForSelector("#date", { state: "visible" });
  await page.waitForSelector("#description", { state: "visible" });

  // Fill date field (required)
  if (data.date) {
    await page.fill("#date", data.date); // Fix: use data.date, not data.description
    console.log("Date filled with:", data.date);
  }

  // Fill description field (required)
  if (data.description) {
    await page.fill("#description", data.description); // Fix: use data.description

    // Verify description was filled
    const filledValue = await page.inputValue("#description");
    console.log("Description filled with:", filledValue);

    // If empty, try alternative method
    if (!filledValue || filledValue !== data.description) {
      await page.click("#description");
      await page.keyboard.press("Control+A");
      await page.keyboard.type(data.description);
      console.log("Used keyboard typing as fallback");
    }
  }

  // Take screenshot of filled form
  await page.screenshot({ path: "form-filled.png", fullPage: true });
});

When("I submit the Add Visit form", async function () {
  const page = this.page!;

  // Verify form data before submitting
  const dateValue = await page.inputValue("#date");
  const descValue = await page.inputValue("#description");

  console.log("Before submit - Date:", dateValue);
  console.log("Before submit - Description:", descValue);

  // Submit the form
  await page.getByRole("button", { name: "Add Visit" }).click();

  // Wait for submission and redirect
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  console.log("Current URL after submit:", page.url());
});

Then(
  "I should see the new visit with date {string} and description {string} for pet {string}",
  async function (
    this: CustomWorld,
    date: string,
    description: string,
    petName: string
  ) {
    const page = this.page!;
    // Wait for Previous Visits table to appear and update
    await page.waitForSelector(
      'b:has-text("Previous Visits") + table.table-striped',
      { timeout: 15000 }
    );
    await page.waitForTimeout(2000); // Extra wait for table to update
    // Select the Previous Visits table by its heading and class
    const visitsTable = page.locator(
      'b:has-text("Previous Visits") + table.table-striped'
    );
    const rows = await visitsTable.locator("tbody tr").all();
    let found = false;
    for (const row of rows) {
      const cells = await row.locator("td").allTextContents();
      if (
        cells.length >= 2 &&
        cells[0].includes(date) &&
        cells[1].includes(description)
      ) {
        found = true;
        break;
      }
    }
    if (!found) {
      // Print table contents for debugging
      const tableText = await visitsTable.textContent();
      throw new Error(
        `Visit with date ${date} and description ${description} not found for pet ${petName}. Table contents: ${tableText}`
      );
    }
  }
);
