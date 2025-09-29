const { expect } = require("@playwright/test");

class AddOwnerPage {
  constructor(page) {
    this.page = page;
  }

  firstNameInput() {
    return this.page.locator('input[name="firstName"]');
  }

  lastNameInput() {
    return this.page.locator('input[name="lastName"]');
  }

  addressInput() {
    return this.page.locator('input[name="address"]');
  }

  cityInput() {
    return this.page.locator('input[name="city"]');
  }

  telephoneInput() {
    return this.page.locator('input[name="telephone"]');
  }

  addOwnerButton() {
    return this.page.getByRole("button", { name: "Add Owner" });
  }
}

module.exports = { AddOwnerPage };
