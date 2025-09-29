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
    // ...existing code...
  } else {
    // ...existing code...
    throw new Error("Test data file not found");
  }
} catch (error) {
  // ...existing code...
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

    // Use actual selector for Add Owner button
    const addOwnerPage =
      new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
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
    await this.page.waitForLoadState("networkidle", { timeout: 2000 });

    // Check for error message after submit
    const errorMessage = await this.page
      .locator(".has-error, .alert-danger")
      .textContent()
      .catch(() => null);
    if (errorMessage) {
      throw new Error("Form submission error: " + errorMessage);
    }

    // Extract owner ID from URL
    const currentUrl = this.page.url();
    const match = /owners\/(\d+)/.exec(currentUrl);
    if (match) {
      createdOwnerId = match[1];
      // ...existing code...
    } else {
      throw new Error(
        "Owner was not created, URL did not change to owner detail page."
      );
    }
  }
);

When("I click the Find Owners link", async function (this: CustomWorld) {
  await homePage.homeNav().click();
  await this.page.waitForLoadState("networkidle");

  await ownersPage.findOwnersNav().click();

  await this.page.waitForSelector('h2:has-text("Find Owners")', {
    timeout: 10000,
  });
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
    // ...existing code...

    await ownersPage.lastNameInput().fill(lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  const findOwnerBtn = ownersPage.findOwnerButton();
  // ...existing code...
  await findOwnerBtn.click();
  await this.page.waitForLoadState("networkidle");

  // Debug logging
  // ...existing code...
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
      await this.page
        .getByRole("heading", { name: "Owner Information" })
        .waitFor({ timeout: 10000 });
      const container = this.page
        .locator(".container")
        .filter({ hasText: ownerName });
      await expect(container).toContainText(ownerName);
      await expect(container).toContainText(address);
      await expect(container).toContainText(city);
      await expect(container).toContainText(telephone);
      found = true;
    } catch {
      // Fallback to owners table
      await this.page.waitForSelector("table#owners tbody tr", {
        timeout: 10000,
      });
      // Refine locator to match all details
      const ownerRows = ownersPage.getOwnerRowByName(ownerName);
      const filteredRow = ownerRows
        .filter({ hasText: address })
        .filter({ hasText: city })
        .filter({ hasText: telephone })
        .first();
      await expect(filteredRow).toBeVisible({ timeout: 10000 });
      await expect(filteredRow).toContainText(ownerName);
      await expect(filteredRow).toContainText(address);
      await expect(filteredRow).toContainText(city);
      await expect(filteredRow).toContainText(telephone);
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
    // Use OwnersPage method for DRY/OOP and always click the first matching owner link
    const owner = testData.updatedOwner || testData.initialOwner;
    const ownerName = `${owner.firstName} ${owner.lastName}`;
    // Always click the first owner link matching the name, no ID needed
    const ownerLink = ownersPage.getOwnerLinkByHref(ownerName).first();
    if ((await ownerLink.count()) === 0) {
      throw new Error(`Owner link not found for ${ownerName}`);
    }
    await ownerLink.waitFor({ state: "visible", timeout: 10000 });
    await expect(ownerLink).toBeEnabled({ timeout: 10000 });
    await ownerLink.click();
    await this.page.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 20000,
    });
  }
);

When("I click the Edit Owner button", async function (this: CustomWorld) {
  // Wait for owner info page to be visible before clicking Edit Owner
  await this.page.waitForSelector('h2:has-text("Owner Information")', {
    timeout: 20000,
  });
  await this.page.waitForSelector('a:has-text("Edit Owner")', {
    timeout: 20000,
  });
  await this.page.click('a:has-text("Edit Owner")');
  await this.page.waitForSelector('h2:has-text("Edit Owner")', {
    timeout: 20000,
  });
});

When("I update owner details from JSON", async function (this: CustomWorld) {
  const owner = testData.updatedOwner;
  // ...existing code...

  const addOwnerPage =
    new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
  await addOwnerPage.firstNameInput().fill(owner.firstName);
  await addOwnerPage.lastNameInput().fill(owner.lastName);
  await addOwnerPage.addressInput().fill(owner.address);
  await addOwnerPage.cityInput().fill(owner.city);
  await addOwnerPage.telephoneInput().fill(owner.telephone);
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  const addOwnerPage =
    new (require("../../src/pages/AddOwnerPage").AddOwnerPage)(this.page);
  await addOwnerPage.addOwnerButton().click();
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the updated owner from JSON",
  async function (this: CustomWorld) {
    const owner = testData.updatedOwner;
    const ownerName = `${owner.firstName} ${owner.lastName}`;

    // ...existing code...
    // Wait for updated owner info page to be visible
    await this.page.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });
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
    // Wait for confirmation message to be visible
    await this.page.waitForSelector(".alert, .success, .message", {
      timeout: 20000,
    });
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
  // ...existing code...

  const { PetPage } = require("../../src/pages/PetPage");
  const petPage = new PetPage(this.page);
  await petPage.nameInput().fill(pet.name);
  await petPage.birthDateInput().fill(pet.birthDate);
  await petPage.typeSelect().selectOption(pet.type);
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  const petPage = new (require("../../src/pages/PetPage").PetPage)(this.page);
  await petPage.submitButton().click();
  await this.page.waitForLoadState("networkidle");
});

Then("I should see the new pet from JSON", async function (this: CustomWorld) {
  const pet = testData.newPet;
  // ...existing code...

  const petsTable = this.page.locator("table.table.table-striped").nth(1);
  await petsTable.waitFor({ state: "visible", timeout: 20000 });
  await expect(petsTable).toContainText(pet.name);
  await expect(petsTable).toContainText(pet.type);
  await expect(petsTable).toContainText(pet.birthDate);
});

When("I click the pet name link from JSON", async function (this: CustomWorld) {
  const petName = testData.newPet.name;
  // ...existing code...

  const petLink = this.page.locator(`a:has-text("${petName}")`).first();
  await petLink.waitFor({ state: "visible", timeout: 20000 });
  await expect(petLink).toBeEnabled({ timeout: 20000 });
  await petLink.click();
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
  // ...existing code...

  const { VisitPage } = require("../../src/pages/VisitPage");
  const visitPage = new VisitPage(this.page);
  await visitPage.dateInput().fill(visit.date);
  await visitPage.descriptionInput().fill(visit.description);
});

When("I submit the Add Visit form", async function (this: CustomWorld) {
  const visitPage = new (require("../../src/pages/VisitPage").VisitPage)(
    this.page
  );
  await visitPage.submitButton().click();
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the new visit from JSON",
  async function (this: CustomWorld) {
    const visit = testData.newVisit;
    // ...existing code...

    const container = this.page.locator(".container").first();
    await expect(container).toContainText(visit.date);
    await expect(container).toContainText(visit.description);
  }
);
