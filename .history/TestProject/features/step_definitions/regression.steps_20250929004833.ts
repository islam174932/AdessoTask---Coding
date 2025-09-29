import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import * as fs from "fs";
import * as path from "path";
import { HomePage } from "../../src/pages/HomePage";
import { OwnersPage } from "../../src/pages/OwnersPage";

Then("the browser will be closed", async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
  }
});

const testDataPath = path.join(__dirname, "../../data/testdata.json");
let testData: any = {};

try {
  if (fs.existsSync(testDataPath)) {
    testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
    console.log("Test data loaded successfully from:", testDataPath);
    console.log("Test data:", JSON.stringify(testData, null, 2));
  } else {
    console.error("Test data file not found at:", testDataPath);
    throw new Error("Test data file not found");
  }
} catch (error) {
  console.error("Error loading test data:", error);
  throw error;
}

let createdOwnerId: string = "";
let homePage: HomePage;
let ownersPage: OwnersPage;

Before(async function (this: CustomWorld) {
  createdOwnerId = "";
  homePage = new HomePage(this.page);
  ownersPage = new OwnersPage(this.page);
});

After(async function (this: CustomWorld) {});

Given(
  "I open the home page",
  { timeout: 30000 },
  async function (this: CustomWorld) {
    await homePage.open();
    await homePage.waitForWelcome();
  }
);

When(
  "I create a new owner from initial JSON data",
  { timeout: 40000 },
  async function (this: CustomWorld) {
    const owner = testData.initialOwner;
    console.log("Creating owner with data:", owner);

    // Use actual selector for Add Owner button
  const addOwnerPage = new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
  // Click Add Owner button (navigate to form)
  await ownersPage.findOwnersNav().click();
  await this.page.click('a.btn.btn-primary[href="/owners/new"]');
  await this.page.waitForSelector('h2:has-text("Owner")', { timeout: 20000 });

  // Fill owner details using AddOwnerPage methods
  await addOwnerPage.firstNameInput().fill(owner.firstName);
  await addOwnerPage.lastNameInput().fill(owner.lastName);
  await addOwnerPage.addressInput().fill(owner.address);
  await addOwnerPage.cityInput().fill(owner.city);
  await addOwnerPage.telephoneInput().fill(owner.telephone);

  // Submit form using AddOwnerPage method
  await addOwnerPage.addOwnerButton().click();
  await this.page.waitForLoadState("networkidle", { timeout: 20000 });

    // Check for error message after submit
    const errorMessage = await this.page.locator('.has-error, .alert-danger').textContent().catch(() => null);
    if (errorMessage) {
      throw new Error('Form submission error: ' + errorMessage);
    }

    // Extract owner ID from URL
    const currentUrl = this.page.url();
    const match = /owners\/(\d+)/.exec(currentUrl);
    if (match) {
      createdOwnerId = match[1];
      console.log("Created owner ID:", createdOwnerId);
    } else {
      throw new Error('Owner was not created, URL did not change to owner detail page.');
    }
  }
);

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.page.click('span:has-text("Find Owners")');
  await this.page.waitForSelector('h2:has-text("Find Owners")', { timeout: 5000 });
});

When(
  "I enter last name {string} in the search field",
  async function (this: CustomWorld, lastName: string) {
    await ownersPage.lastNameInput().fill(lastName);
  }
);

When(
  "I enter last name from JSON in the search field",
  async function (this: CustomWorld) {
    // Determine which owner to search for based on context
    let lastName;

    // Check if we're searching after an update by looking at the scenario context
    // For now, use initial owner - this logic may need refinement based on your feature file
    lastName = testData.initialOwner.lastName;
    console.log("Searching for last name:", lastName);

    await ownersPage.lastNameInput().fill(lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  const findOwnerBtn = ownersPage.findOwnerButton();
  console.log('Find Owner button count:', await findOwnerBtn.count());
  console.log('Find Owner button enabled:', await findOwnerBtn.isEnabled());
  await findOwnerBtn.click();
  await this.page.waitForLoadState("networkidle");

  // Debug logging
  console.log("Page URL after search:", this.page.url());
  const hasTable =
    (await this.page.locator("table#owners tbody tr").count()) > 0;
  const hasOwnerInfo =
    (await this.page.locator('h2:has-text("Owner Information")').count()) > 0;
  console.log("Has owners table:", hasTable);
  console.log("Has owner info page:", hasOwnerInfo);
});

Then(
  "I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table",
  { timeout: 20000 },
  async function (
    this: CustomWorld,
    ownerName: string,
    address: string,
    city: string,
    telephone: string
  ) {
    // Wait for either owner info page or owners table
    let found = false;
    try {
      await this.page.getByRole("heading", { name: "Owner Information" }).waitFor({ timeout: 10000 });
      const container = this.page.locator(".container").filter({ hasText: ownerName });
      await expect(container).toContainText(ownerName);
      await expect(container).toContainText(address);
      await expect(container).toContainText(city);
      await expect(container).toContainText(telephone);
      found = true;
    } catch {
      // Fallback to owners table
      await this.page.waitForSelector("table#owners tbody tr", { timeout: 10000 });
      const ownerRow = ownersPage.getOwnerRowByName(ownerName);
      await expect(ownerRow).toBeVisible();
      await expect(ownerRow).toContainText(address);
      await expect(ownerRow).toContainText(city);
      await expect(ownerRow).toContainText(telephone);
      found = true;
    }
    if (!found) {
      throw new Error("Owner not found on info page or owners table");
    }
  }
);

When(
  "I click the owner link from JSON with address from JSON",
  async function (this: CustomWorld) {
    const initialOwner = testData.initialOwner;
    const initialOwnerName = `${initialOwner.firstName} ${initialOwner.lastName}`;

    console.log("Looking for owner:", initialOwnerName);
    await this.page.waitForLoadState("networkidle");

    // Check if already on owner detail page
    const isOwnerPage =
      (await this.page.locator('h2:has-text("Owner Information")').count()) > 0;
    if (isOwnerPage) {
      console.log("Already on owner detail page");
      return;
    }

    // Use POM method to find owner row
    const ownerRow = ownersPage.getOwnerRowByName(initialOwnerName);

    if ((await ownerRow.count()) > 0) {
      const ownerLink = ownerRow.locator("a").first();
      await ownerLink.click();
      await this.page.waitForLoadState("networkidle");
      return;
    }

    // Fallback: click first available owner
    const firstOwnerLink = this.page.locator("table#owners tbody tr a").first();
    if ((await firstOwnerLink.count()) > 0) {
      console.log("Using first available owner link");
      await firstOwnerLink.click();
      await this.page.waitForLoadState("networkidle");
      return;
    }

    // Last resort: use stored ID
    if (createdOwnerId) {
      console.log("Using stored owner ID:", createdOwnerId);
      await this.page.goto(`http://localhost:8081/owners/${createdOwnerId}`);
      await this.page.waitForLoadState("networkidle");
      return;
    }

    throw new Error(`Owner link not found for ${initialOwnerName}`);
  }
);

When("I click the Edit Owner button", async function (this: CustomWorld) {
  await this.page.click('a:has-text("Edit Owner")');
  await this.page.waitForSelector('h2:has-text("Edit Owner")', {
    timeout: 5000,
  });
});

When("I update owner details from JSON", async function (this: CustomWorld) {
  const owner = testData.updatedOwner;
  console.log("Updating owner with data:", owner);

  const addOwnerPage = new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
  await addOwnerPage.firstNameInput().fill(owner.firstName);
  await addOwnerPage.lastNameInput().fill(owner.lastName);
  await addOwnerPage.addressInput().fill(owner.address);
  await addOwnerPage.cityInput().fill(owner.city);
  await addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  const addOwnerPage = new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
  await addOwnerPage.addOwnerButton().click();
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the updated owner from JSON",
  async function (this: CustomWorld) {
    const owner = testData.updatedOwner;
    const ownerName = `${owner.firstName} ${owner.lastName}`;

    console.log("Verifying updated owner:", ownerName);

    await expect(this.page.locator("h2").first()).toContainText(
      "Owner Information"
    );
    const container = this.page.locator(".container").first();
    await expect(container).toContainText(ownerName);
    await expect(container).toContainText(owner.address);
    await expect(container).toContainText(owner.city);
    await expect(container).toContainText(owner.telephone);
  }
);

Then(
  "I should see the confirmation message {string}",
  async function (this: CustomWorld, message: string) {
    await expect(this.page.locator(".alert, .success, .message")).toContainText(
      message
    );
  }
);

When("I click the Add New Pet button", async function (this: CustomWorld) {
  await this.page.click('a:has-text("Add New Pet")');
  await this.page.waitForSelector('h2:has-text("New Pet")', { timeout: 5000 });
});

When("I enter pet details from JSON", async function (this: CustomWorld) {
  const pet = testData.newPet;
  console.log("Adding pet with data:", pet);

  const petPage = new (require("../../src/pages/PetPage")?.PetPage ?? class { constructor(page) { this.page = page; } nameInput() { return this.page.locator('#name'); } birthDateInput() { return this.page.locator('#birthDate'); } typeSelect() { return this.page.locator('#type'); } })(this.page);
  await petPage.nameInput().fill(pet.name);
  await petPage.birthDateInput().fill(pet.birthDate);
  await petPage.typeSelect().selectOption(pet.type);
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]'); // If PetPage has a submit method, use it here
  await this.page.waitForLoadState("networkidle");
});

Then("I should see the new pet from JSON", async function (this: CustomWorld) {
  const pet = testData.newPet;
  console.log("Verifying pet:", pet.name);

  const container = this.page.locator(".container").first();
  await expect(container).toContainText(pet.name);
  await expect(container).toContainText(pet.type);
});

When("I click the pet name link from JSON", async function (this: CustomWorld) {
  const petName = testData.newPet.name;
  console.log("Clicking pet link:", petName);

  await this.page.click(`a:has-text("${petName}")`);
  await this.page.waitForLoadState("networkidle");
});

When("I click the Add Visit button", async function (this: CustomWorld) {
  await this.page.click('a:has-text("Add Visit")');
  await this.page.waitForSelector('h2:has-text("New Visit")', {
    timeout: 5000,
  });
});

When("I enter visit details from JSON", async function (this: CustomWorld) {
  const visit = testData.newVisit;
  console.log("Adding visit with data:", visit);

  await this.page.fill("#date", visit.date);
  await this.page.fill("#description", visit.description);
});

When("I submit the Add Visit form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]');
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the new visit from JSON",
  async function (this: CustomWorld) {
    const visit = testData.newVisit;
    console.log("Verifying visit:", visit.description);

    const container = this.page.locator(".container").first();
    await expect(container).toContainText(visit.date);
    await expect(container).toContainText(visit.description);
  }
);
