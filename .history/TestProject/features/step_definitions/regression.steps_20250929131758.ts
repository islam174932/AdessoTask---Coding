import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { loadJson } from "./base.steps";
import { AlertPage } from "../../src/pages/AlertPage";
import "./base.steps";

// Helper function to get test data
async function getTestData() {
  return await loadJson("../../data/testdata.json", __dirname);
}

// ==================== REGRESSION-SPECIFIC STEPS ====================

When("I click the Add Owner button", async function (this: CustomWorld) {
  await this.addOwnerPage!.addOwnerLink().click();
  await this.page!.locator("form#add-owner-form").waitFor({
    state: "visible",
    timeout: 10000,
  });
  await this.page!.screenshot({
    path: "screenshots/add-owner-form-debug.png",
    fullPage: true,
  });
});

When(
  "I enter owner details from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    try {
      console.log(`Loading test scenario: ${scenarioName}`);
      const testData = await getTestData();
      const scenario = testData.testScenarios[scenarioName];
      const ownerIndex = scenario.ownerIndex;
      const owner = testData.owners[ownerIndex];

      console.log(`Using owner data:`, owner);
      (this as any).lastOwner = owner;
      (this as any).currentScenario = scenarioName;

      await this.page!.screenshot({
        path: "screenshots/before-form-fill.png",
        fullPage: true,
      });

      console.log("Filling firstName:", owner.firstName);
      await this.addOwnerPage!.firstNameInput().waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.addOwnerPage!.firstNameInput().fill(owner.firstName);

      console.log("Filling lastName:", owner.lastName);
      await this.addOwnerPage!.lastNameInput().waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.addOwnerPage!.lastNameInput().fill(owner.lastName);

      console.log("Filling address:", owner.address);
      await this.addOwnerPage!.addressInput().waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.addOwnerPage!.addressInput().fill(owner.address);

      console.log("Filling city:", owner.city);
      await this.addOwnerPage!.cityInput().waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.addOwnerPage!.cityInput().fill(owner.city);

      console.log("Filling telephone:", owner.telephone);
      await this.addOwnerPage!.telephoneInput().waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.addOwnerPage!.telephoneInput().fill(owner.telephone);

      console.log("Form filling completed successfully!");
    } catch (error) {
      console.log("ERROR during form filling:", (error as Error).message);
      await this.page!.screenshot({
        path: "screenshots/form-fill-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

When(
  "I search for owner using test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const lastName = scenario.searchLastName;

    (this as any).currentScenario = scenarioName;
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

When(
  "I search and edit owner using test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const lastName = scenario.searchLastName;

    (this as any).currentScenario = scenarioName;
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

When(
  "I search and select owner using test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const lastName = scenario.searchLastName;

    (this as any).currentScenario = scenarioName;
    await this.ownersPage!.lastNameInput().fill(lastName);
  }
);

When(
  "I click the owner link from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const owner = testData.owners[scenario.ownerIndex];
    const fullName = `${owner.firstName} ${owner.lastName}`;
    const address = owner.address;

    const row = this.ownersPage!.getOwnerRowByName(fullName)
      .filter({ hasText: address })
      .first();
    const nameLink = row.getByRole("link", { name: fullName });
    await expect(nameLink).toBeVisible();
    await nameLink.click();
  }
);

Then(
  "I should see the owner in the owners table from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const owner = testData.owners[scenario.expectedOwnerIndex];
    const fullName = `${owner.firstName} ${owner.lastName}`;

    const row = this.ownersPage!.getOwnerRowByName(fullName).first();
    await expect(row.getByRole("link", { name: fullName })).toBeVisible();
    await expect(row.getByText(owner.address)).toBeVisible();
    await expect(row.getByText(owner.city)).toBeVisible();
    await expect(row.getByText(owner.telephone)).toBeVisible();
  }
);

When("I submit the Add Owner form", async function (this: CustomWorld) {
  try {
    console.log("About to submit form...");

    const submitBtn = this.addOwnerPage!.addOwnerSubmitButton();
    await submitBtn.waitFor({ state: "visible", timeout: 15000 });

    console.log("Submit button is visible, clicking...");
    await submitBtn.click();

    console.log("Submit button clicked, waiting for navigation...");
    await this.page!.waitForLoadState("networkidle", { timeout: 15000 });

    console.log("Form submitted successfully!");
  } catch (error) {
    console.log("ERROR during form submission:", (error as Error).message);
    await this.page!.screenshot({
      path: "screenshots/submit-error.png",
      fullPage: true,
    });
    throw error;
  }
});

Then("I should see the new owner added", async function (this: CustomWorld) {
  try {
    const owner = (this as any).lastOwner;

    await this.page!.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });

    console.log("Validating new owner details...");

    const detailsTable = this.page!.locator("table.table-striped").first();

    await expect(
      detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
    ).toBeVisible();
    await expect(detailsTable.getByText(owner.address)).toBeVisible();
    await expect(detailsTable.getByText(owner.city)).toBeVisible();
    await expect(detailsTable.getByText(owner.telephone)).toBeVisible();

    console.log("New owner details validated successfully");
  } catch (error) {
    console.log("ERROR validating new owner:", (error as Error).message);
    await this.page!.screenshot({
      path: "screenshots/validate-owner-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When("I click the Edit Owner button", async function (this: CustomWorld) {
  const editLink = this.ownersPage!.getEditOwnerButton();
  await expect(editLink).toBeVisible();
  await editLink.click();
});

When("I clear all owner fields", async function (this: CustomWorld) {
  try {
    console.log("Clearing all owner fields...");

    await this.addOwnerPage!.firstNameInput().clear();
    await this.addOwnerPage!.lastNameInput().clear();
    await this.addOwnerPage!.addressInput().clear();
    await this.addOwnerPage!.cityInput().clear();
    await this.addOwnerPage!.telephoneInput().clear();

    console.log("All fields cleared successfully");
  } catch (error) {
    console.log("ERROR clearing fields:", (error as Error).message);
    await this.page!.screenshot({
      path: "screenshots/clear-fields-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I update owner details from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    try {
      console.log("Loading owner data for update...");
      const testData = await getTestData();
      const scenario = testData.testScenarios[scenarioName];
      const owner = testData.owners[scenario.toOwnerIndex];

      console.log(`Using owner data:`, owner);
      (this as any).updatedOwner = owner;

      console.log("Filling firstName:", owner.firstName);
      await this.addOwnerPage!.firstNameInput().fill(owner.firstName);

      console.log("Filling lastName:", owner.lastName);
      await this.addOwnerPage!.lastNameInput().fill(owner.lastName);

      console.log("Filling address:", owner.address);
      await this.addOwnerPage!.addressInput().fill(owner.address);

      console.log("Filling city:", owner.city);
      await this.addOwnerPage!.cityInput().fill(owner.city);

      console.log("Filling telephone:", owner.telephone);
      await this.addOwnerPage!.telephoneInput().fill(owner.telephone);

      console.log("Owner update form filled successfully");
    } catch (error) {
      console.log("ERROR updating owner details:", (error as Error).message);
      await this.page!.screenshot({
        path: "screenshots/update-owner-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

When("I submit the Update Owner form", async function (this: CustomWorld) {
  await this.addOwnerPage!.addOwnerSubmitButton().click();
  await this.page!.waitForLoadState("networkidle", { timeout: 15000 });
});

Then(
  "I should see the updated owner details",
  async function (this: CustomWorld) {
    try {
      const owner = (this as any).updatedOwner;

      await this.page!.waitForSelector('h2:has-text("Owner Information")', {
        timeout: 10000,
      });

      console.log("Validating updated owner details...");

      const detailsTable = this.page!.locator("table.table-striped").first();

      await expect(
        detailsTable.getByText(`${owner.firstName} ${owner.lastName}`)
      ).toBeVisible();
      await expect(detailsTable.getByText(owner.address)).toBeVisible();
      await expect(detailsTable.getByText(owner.city)).toBeVisible();
      await expect(detailsTable.getByText(owner.telephone)).toBeVisible();

      console.log("Updated owner details validated successfully");
    } catch (error) {
      console.log("ERROR validating updated owner:", (error as Error).message);
      await this.page!.screenshot({
        path: "screenshots/validate-update-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

When("I click the Add New Pet button", async function (this: CustomWorld) {
  await this.petPage!.addNewPetButton().click();
});

When(
  "I enter pet details from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    const testData = await getTestData();
    const scenario = testData.testScenarios[scenarioName];
    const pet = testData.pets[scenario.petIndex];

    if (!pet)
      throw new Error(`No pet data found for scenario: ${scenarioName}`);

    const uniqueName = `${pet.name}_${Date.now()}`;
    (this as any).currentPetName = uniqueName;

    await this.petPage!.nameInput().fill(uniqueName);
    await this.petPage!.birthDateInput().fill(pet.birthDate);
    await this.petPage!.typeSelect().selectOption({ value: pet.type });
  }
);

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.petPage!.submitButton().click();
  await this.page!.waitForTimeout(1500);
});

When("I click the Add Visit button", async function (this: CustomWorld) {
  try {
    await this.page!.waitForSelector('h2:has-text("Owner Information")', {
      timeout: 10000,
    });
    await this.page!.waitForTimeout(1000);

    const addVisitButton = this.visitPage!.addVisitButton();
    await addVisitButton.waitFor({ state: "visible", timeout: 10000 });
    await addVisitButton.click();

    console.log("Add Visit button clicked successfully");
  } catch (error) {
    console.log("ERROR clicking Add Visit button:", (error as Error).message);
    await this.page!.screenshot({
      path: "screenshots/add-visit-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I enter visit details from test scenario {string}",
  async function (this: CustomWorld, scenarioName: string) {
    try {
      console.log("Loading visit data...");
      const testData = await getTestData();
      const scenario = testData.testScenarios[scenarioName];
      const visit = testData.visits[scenario.visitIndex];

      if (!visit)
        throw new Error(`No visit data found for scenario: ${scenarioName}`);

      console.log("Using visit data:", visit);
      (this as any).currentVisit = visit;

      console.log("Filling visit description:", visit.description);
      await this.visitPage!.descriptionInput().fill(visit.description);

      console.log("Visit form filled successfully");
    } catch (error) {
      console.log("ERROR filling visit details:", (error as Error).message);
      await this.page!.screenshot({
        path: "screenshots/visit-fill-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

When("I submit the Add Visit form", async function (this: CustomWorld) {
  await this.visitPage!.submitButton().click();
  await this.page!.waitForLoadState("networkidle");
});

// ==================== SUCCESS MESSAGE VALIDATION STEPS ====================

Then(
  "I should see new owner created message",
  async function (this: CustomWorld) {
    const alertPage = new AlertPage(this.page!);
    await alertPage.validateNewOwnerCreated();
  }
);

Then("I should see owner updated message", async function (this: CustomWorld) {
  const alertPage = new AlertPage(this.page!);
  await alertPage.validateOwnerUpdated();
});

Then("I should see new pet added message", async function (this: CustomWorld) {
  const alertPage = new AlertPage(this.page!);
  await alertPage.validateNewPetAdded();
});

Then("I should see visit booked message", async function (this: CustomWorld) {
  const alertPage = new AlertPage(this.page!);
  await alertPage.validateVisitBooked();
});
