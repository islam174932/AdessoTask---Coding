export class AddOwnerPage {
  constructor(private readonly page: import("playwright").Page) {}

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

  addOwnerLink() {
    return this.page.locator('a.btn.btn-primary[href="/owners/new"]');
  }

  addOwnerSubmitButton() {
    return this.page.locator('form#add-owner-form button.btn.btn-primary[type="submit"]');
  }
}
