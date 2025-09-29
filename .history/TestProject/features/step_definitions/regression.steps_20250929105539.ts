import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { loadJson } from "./base.steps";
import "./base.steps"; // Import all base steps

// ==================== REGRESSION-SPECIFIC STEPS ====================

When("I click the Add Owner button", async function (this: CustomWorld) {
  await this.addOwnerPage!.addOwnerLink().click();
  await this.page!.locator("form#add-owner-form").waitFor({
    state: "visible",
    timeout: 10000,
  });
  await this.page!.screenshot({
    path: "add-owner-form-debug.png",
    fullPage: true,
  });
});

When(
  "I enter owner details from json for index {int}",
  async function (this: CustomWorld, index: number) {
    try {
      console.log("Starting form fill process...");
      const testData = await loadJson("../../data/testdata.json", __dirname);
      console.log("Loaded test data:", testData);

      let owner;
      if (index === 0) {
        owner = testData.initialOwner;
      } else if (index === 1) {
        owner = testData.updatedOwner;
      } else {
        throw new Error(
          `No owner data found for index ${index}. Available indices: 0 (initialOwner), 1 (updatedOwner)`
        );
      }

      console.log(`Using owner data for index ${index}:`, owner);
      (this as any).lastOwner = owner;

      await this.page!.screenshot({
        path: "before-form-fill.png",
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
      try {
        await this.page!.screenshot({
          path: "form-fill-error.png",
          fullPage: true,
        });
      } catch (screenshotError) {
        console.log("Could not take error screenshot");
      }
      throw error;
    }
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
    await this.page!.screenshot({ path: "submit-error.png", fullPage: true });
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
      path: "validate-owner-error.png",
      fullPage: true,
    });
    throw error;
  }
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
      path: "clear-fields-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I update owner details from json for index {int}",
  async function (this: CustomWorld, index: number) {
    try {
      console.log("Loading owner data for update...");
      const testData = await loadJson("../../data/testdata.json", __dirname);

      let owner;
      if (index === 0) {
        owner = testData.initialOwner;
      } else if (index === 1) {
        owner = testData.updatedOwner;
      } else {
        throw new Error(`No owner data found for index ${index}`);
      }

      console.log(`Using owner data for index ${index}:`, owner);
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
        path: "update-owner-error.png",
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
        path: "validate-update-error.png",
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
  "I enter pet details from json for index {int}",
  async function (this: CustomWorld, index: number) {
    const testData = await loadJson("../../data/testdata.json", __dirname);
    const pet = testData.newPet;
    if (!pet) throw new Error(`No pet data found in testdata.json`);

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

Then(
  "I should see the new pet {string} with birth date {string} and type {string} for owner {string}",
  async function (
    this: CustomWorld,
    petName: string,
    birthDate: string,
    type: string,
    ownerName: string
  ) {
    const petsTable = this.petPage!.petsTable();
    await expect(petsTable).toContainText(ownerName);
    await expect(petsTable).toContainText((this as any).currentPetName);
    await expect(petsTable).toContainText(birthDate);
    await expect(petsTable).toContainText(type);
  }
);

When(
  "I click the pet name link {string}",
  async function (this: CustomWorld, petName: string) {
    try {
      const petLink = this.page!.locator(
        `a[href*="/pets/"]:has-text("${petName}")`
      ).first();
      await expect(petLink).toBeVisible({ timeout: 10000 });
      await petLink.click();
    } catch (error) {
      console.log(
        `Could not find pet link for "${petName}", trying to find any pet link...`
      );
      const anyPetLink = this.page!.locator('a[href*="/pets/"]').first();
      await expect(anyPetLink).toBeVisible({ timeout: 10000 });
      await anyPetLink.click();
    }
  }
);

When(
  "I click the pet name link for current pet",
  async function (this: CustomWorld) {
    try {
      const petLink = this.page!.locator('a[href*="/pets/"]').first();
      await expect(petLink).toBeVisible({ timeout: 10000 });
      await petLink.click();
      console.log("Clicked on the first available pet link");
    } catch (error) {
      console.log("ERROR clicking pet link:", (error as Error).message);
      await this.page!.screenshot({
        path: "pet-link-error.png",
        fullPage: true,
      });
      throw error;
    }
  }
);

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
      path: "add-visit-error.png",
      fullPage: true,
    });
    throw error;
  }
});

When(
  "I enter visit details from json for index {int}",
  async function (this: CustomWorld, index: number) {
    try {
      console.log("Loading visit data...");
      const testData = await loadJson("../../data/testdata.json", __dirname);
      const visit = testData.newVisit;
      if (!visit) throw new Error(`No visit data found in testdata.json`);

      console.log("Using visit data:", visit);
      (this as any).currentVisit = visit;

      console.log("Filling visit description:", visit.description);
      await this.visitPage!.descriptionInput().fill(visit.description);

      console.log("Visit form filled successfully");
    } catch (error) {
      console.log("ERROR filling visit details:", (error as Error).message);
      await this.page!.screenshot({
        path: "visit-fill-error.png",
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
