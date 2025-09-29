Then("the browser will be closed", async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
  }
});

const testDataPath = path.join(__dirname, "../test-data/owners.json");
let testData: any = {};

try {
  if (fs.existsSync(testDataPath)) {
    testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));
  }
} catch (error) {
  testData = {
    initialOwner: {
      firstName: "Islam",
      lastName: "Ibrahim",
      address: "000 Pine Rd.",
      city: "Cairo",
      telephone: "5551234567",
    },
    updatedOwner: {
      firstName: "Layla",
      lastName: "Hassan",
      address: "123 Oak St.",
      city: "Damascus",
      telephone: "5559876543",
    },
    newPet: {
      name: "Fluffy",
      birthDate: "2023-01-15",
      type: "cat",
    },
    newVisit: {
      date: "2024-01-20",
      description: "Regular checkup",
    },
  };
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
  async function (this: CustomWorld) {
    await this.page.click('a[href="/owners/new"]');
    await this.page.waitForSelector('h2:has-text("New Owner")', {
      timeout: 5000,
    });
    await this.page.fill("#firstName", testData.initialOwner.firstName);
    await this.page.fill("#lastName", testData.initialOwner.lastName);
    await this.page.fill("#address", testData.initialOwner.address);
    await this.page.fill("#city", testData.initialOwner.city);
    await this.page.fill("#telephone", testData.initialOwner.telephone);
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState("networkidle");
    const currentUrl = this.page.url();
    const match = currentUrl.match(/owners\/(\d+)/);
    if (match) {
      createdOwnerId = match[1];
    }
  }
);

When("I click the Find Owners link", async function (this: CustomWorld) {
  await this.page.click('a[href="/owners/find"]');
  await this.page.waitForSelector('h2:has-text("Find Owners")', {
    timeout: 5000,
  });
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
    // After update, we search for Layla (the updated owner)
    const lastName = testData.updatedOwner?.lastName || "Hassan";
    await this.page.fill("#lastName", lastName);
  }
);

When("I click the Find Owner button", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]:has-text("Find Owner")');
  await this.page.waitForLoadState("networkidle");
});

// Step 2: Search for newly created owner (Islam) and validate
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
    // Wait for results
    await this.page.waitForSelector(
      'table tbody tr, h2:contains("Owner Information")',
      { timeout: 10000 }
    );

    // Check if single owner found (direct to owner page) or multiple owners (table)
    const isOwnerPage =
      (await this.page.locator('h2:has-text("Owner Information")').count()) > 0;

    if (isOwnerPage) {
      // Single owner found - verify details on owner page
      await expect(this.page.locator(".container")).toContainText(ownerName);
      await expect(this.page.locator(".container")).toContainText(address);
      await expect(this.page.locator(".container")).toContainText(city);
      await expect(this.page.locator(".container")).toContainText(telephone);
    } else {
      // Multiple owners - check table
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

// Step 3: Update the created owner (Islam → Layla)
When(
  "I click the owner link from JSON with address from JSON",
  async function (this: CustomWorld) {
    // Look for the updated owner (Layla) after the update has happened
    const ownerName = `${testData.updatedOwner.firstName} ${testData.updatedOwner.lastName}`;
    const address = testData.updatedOwner.address;

    // Try to find owner link by name first
    let ownerLink = this.page.locator(`a:has-text("${ownerName}")`);

    if ((await ownerLink.count()) === 0) {
      // If not found by name, try by address in the row
      const ownerRow = this.page.locator(`tr:has-text("${address}")`);
      ownerLink = ownerRow.locator("a").first();
    }

    if ((await ownerLink.count()) === 0) {
      // If still not found, try using the stored owner ID
      if (createdOwnerId) {
        await this.page.goto(`http://localhost:8080/owners/${createdOwnerId}`);
        return;
      }
      throw new Error(
        `Owner link for ${ownerName} with address ${address} not found.`
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
  // Clear and fill with Layla's data (updating Islam to become Layla)
  await this.page.fill("#firstName", testData.updatedOwner.firstName);
  await this.page.fill("#lastName", testData.updatedOwner.lastName);
  await this.page.fill("#address", testData.updatedOwner.address);
  await this.page.fill("#city", testData.updatedOwner.city);
  await this.page.fill("#telephone", testData.updatedOwner.telephone);
});

When("I submit the Update Owner form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]:has-text("Update Owner")');
  await this.page.waitForLoadState("networkidle");
});

Then(
  "I should see the updated owner from JSON",
  async function (this: CustomWorld) {
    // Verify the owner is now Layla (updated from Islam)
    const ownerName = `${testData.updatedOwner.firstName} ${testData.updatedOwner.lastName}`;
    await expect(this.page.locator("h2")).toContainText("Owner Information");
    await expect(this.page.locator(".container")).toContainText(ownerName);
    await expect(this.page.locator(".container")).toContainText(
      testData.updatedOwner.address
    );
    await expect(this.page.locator(".container")).toContainText(
      testData.updatedOwner.city
    );
    await expect(this.page.locator(".container")).toContainText(
      testData.updatedOwner.telephone
    );
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

// Pet-related steps
When("I click the Add New Pet button", async function (this: CustomWorld) {
  await this.page.click('a:has-text("Add New Pet")');
  await this.page.waitForSelector('h2:has-text("New Pet")', { timeout: 5000 });
});

When("I enter pet details from JSON", async function (this: CustomWorld) {
  await this.page.fill("#name", testData.newPet.name);
  await this.page.fill("#birthDate", testData.newPet.birthDate);
  await this.page.selectOption("#type", testData.newPet.type);
});

When("I submit the Add Pet form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]');
  await this.page.waitForLoadState("networkidle");
});

Then("I should see the new pet from JSON", async function (this: CustomWorld) {
  await expect(this.page.locator(".container")).toContainText(
    testData.newPet.name
  );
  await expect(this.page.locator(".container")).toContainText(
    testData.newPet.type
  );
});

When("I click the pet name link from JSON", async function (this: CustomWorld) {
  await this.page.click(`a:has-text("${testData.newPet.name}")`);
  await this.page.waitForLoadState("networkidle");
});

When("I click the Add Visit button", async function (this: CustomWorld) {
  await this.page.click('a:has-text("Add Visit")');
  await this.page.waitForSelector('h2:has-text("New Visit")', {
    timeout: 5000,
  });
});

When("I enter visit details from JSON", async function (this: CustomWorld) {
  await this.page.fill("#date", testData.newVisit.date);
  await this.page.fill("#description", testData.newVisit.description);
});

When("I submit the Add Visit form", async function (this: CustomWorld) {
  await this.page.click('button[type="submit"]');
  await this.page.waitForLoadState("networkidle");
});
