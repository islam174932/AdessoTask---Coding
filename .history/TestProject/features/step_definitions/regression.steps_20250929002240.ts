import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import * as fs from "fs";
import * as path from "path";
import { HomePage } from "../../src/pages/HomePage";

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

Before(async function (this: CustomWorld) {
  createdOwnerId = "";
});

After(async function (this: CustomWorld) {});

Given(
  "I open the home page",
  { timeout: 10000 },
  async function (this: CustomWorld) {
    const homePage = new HomePage(this.page);
    await homePage.open();
    await homePage.waitForWelcome();
  }
);

When(
  "I create a new owner from initial JSON data",
  { timeout: 30000 },
  async function (this: CustomWorld) {
    const owner = testData.initialOwner;
    console.log("Creating owner with data:", owner);

    // Use getByRole for button reliability
    await this.page.getByRole("link", { name: "Add Owner" }).click();
    await this.page.getByRole("heading", { name: "New Owner" }).waitFor({ timeout: 15000 });

    await this.page.fill("#firstName", "");
    await this.page.fill("#firstName", owner.firstName);
    await this.page.fill("#lastName", "");
    await this.page.fill("#lastName", owner.lastName);
    await this.page.fill("#address", "");
    await this.page.fill("#address", owner.address);
    await this.page.fill("#city", "");
    await this.page.fill("#city", owner.city);
    await this.page.fill("#telephone", "");
    await this.page.fill("#telephone", owner.telephone);

    await this.page.getByRole("button", { name: "Add Owner" }).click();
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    const currentUrl = this.page.url();
    const match = currentUrl.match(/owners\/(\d+)/);
    if (match) {
      createdOwnerId = match[1];
      console.log("Created owner ID:", createdOwnerId);
    }
  }
);

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.page.getByRole("link", { name: "Find Owners" }).click();
  await this.page.getByRole("heading", { name: "Find Owners" }).waitFor({ timeout: 5000 });
});

When(
  "I enter last name {string} in the search field",
  async function (this: CustomWorld, lastName: string) {
    await this.page.fill("#lastName", lastName);
  }
);

When(
  "I enter last name from JSON in the search field",
  async function (this: CustomWorld) {
    // For scenarios that haven't updated yet, search for initial owner
    // This step should be context-aware based on which scenario is running
    const currentUrl = this.page.url();
    let lastName;

    // If we're in the first search (before update), use initial owner
    if (currentUrl.includes("find") || !currentUrl.includes("owners/")) {
      lastName = testData.initialOwner.lastName;
      console.log("Searching for initial owner last name:", lastName);
    } else {
      // If we're searching after an update, use updated owner
      lastName = testData.updatedOwner.lastName;
      console.log("Searching for updated owner last name:", lastName);
    }

    await this.page.fill("#lastName", lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]:has-text("Find Owner")');
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the owner {string} with address {string}, city {string}, and telephone {string} in the owners table",
  { timeout: 15000 },
  async function (
    this: CustomWorld,
    ownerName: string,
    address: string,
    city: string,
    telephone: string
  ) {
    await this.page.waitForSelector("table tbody tr", { timeout: 10000 });

    const isOwnerPage =
      (await this.page
        .locator("h2")
        .filter({ hasText: "Owner Information" })
        .count()) > 0;
    if (isOwnerPage) {
      const container = this.page.locator(".container").first();
      await expect(container).toContainText(ownerName);
      await expect(container).toContainText(address);
      await expect(container).toContainText(city);
      await expect(container).toContainText(telephone);
    } else {
      const ownerRow = this.page.locator(
        `table tbody tr:has-text("${ownerName}")`
      );
      await expect(ownerRow).toBeVisible();
      await expect(ownerRow).toContainText(address);
      await expect(ownerRow).toContainText(city);
      await expect(ownerRow).toContainText(telephone);
    }
  }
);

When(
  "I click the owner link from JSON with address from JSON",
  async function (this: CustomWorld) {
    // First try to find the initial owner (Islam Ibrahim), not the updated one
    const initialOwner = testData.initialOwner;
    const initialOwnerName = `${initialOwner.firstName} ${initialOwner.lastName}`;
    const initialAddress = initialOwner.address;

    console.log(
      "Looking for initial owner:",
      initialOwnerName,
      "with address:",
      initialAddress
    );

    let ownerLink = this.page.locator(`a:has-text("${initialOwnerName}")`);

    if ((await ownerLink.count()) === 0) {
      const ownerRow = this.page.locator(`tr:has-text("${initialAddress}")`);
      ownerLink = ownerRow.locator("a").first();
    }

    // If still not found, try the updated owner data
    if ((await ownerLink.count()) === 0) {
      const updatedOwner = testData.updatedOwner;
      const updatedOwnerName = `${updatedOwner.firstName} ${updatedOwner.lastName}`;
      const updatedAddress = updatedOwner.address;

      console.log(
        "Looking for updated owner:",
        updatedOwnerName,
        "with address:",
        updatedAddress
      );

      ownerLink = this.page.locator(`a:has-text("${updatedOwnerName}")`);

      if ((await ownerLink.count()) === 0) {
        const ownerRow = this.page.locator(`tr:has-text("${updatedAddress}")`);
        ownerLink = ownerRow.locator("a").first();
      }
    }

    if ((await ownerLink.count()) === 0) {
      if (createdOwnerId) {
        await this.page.goto(`http://localhost:8080/owners/${createdOwnerId}`);
        return;
      }
      throw new Error(
        `Owner link not found for either ${initialOwnerName} or updated owner.`
      );
    }

    await ownerLink.click();
    await this.page.waitForLoadState("networkidle");
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

  await this.page.fill("#firstName", owner.firstName);
  await this.page.fill("#lastName", owner.lastName);
  await this.page.fill("#address", owner.address);
  await this.page.fill("#city", owner.city);
  await this.page.fill("#telephone", owner.telephone);
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]:has-text("Update Owner")');
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the updated owner from JSON",
  async function (this: CustomWorld) {
    const owner = testData.updatedOwner;
    const ownerName = `${owner.firstName} ${owner.lastName}`;

    console.log("Verifying updated owner:", ownerName);

    await expect(this.page.locator("h2")).toContainText("Owner Information");
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

  await this.page.fill("#name", pet.name);
  await this.page.fill("#birthDate", pet.birthDate);
  await this.page.selectOption("#type", pet.type);
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]');
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
