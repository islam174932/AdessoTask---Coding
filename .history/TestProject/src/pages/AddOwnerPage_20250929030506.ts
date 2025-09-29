export class AddOwnerPage {
  constructor(private readonly page: import("playwright").Page) {}

  firstNameInput() {
    return this.page.locator("input#firstName");
  }

  lastNameInput() {
    return this.page.locator("input#lastName");
  }

  addressInput() {
    return this.page.locator("input#address");
  }

  cityInput() {
    return this.page.locator("input#city");
  }

  telephoneInput() {
    return this.page.locator("input#telephone");
  }

  addOwnerLink() {
    return this.page.locator('a.btn.btn-primary[href="/owners/new"]');
  }

  addOwnerSubmitButton() {
    return this.page.locator(
      'form#add-owner-form button.btn.btn-primary[type="submit"]'
    );
  }
}
