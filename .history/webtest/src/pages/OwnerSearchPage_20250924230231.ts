import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class OwnerSearchPage extends BasePage {
  getFirstNameInput() {
    return this.page.locator("#firstName");
  }

  async fillFirstName(name: string) {
    await this.getFirstNameInput().fill(name);
  }

  getAddressInput() {
    return this.page.locator("#address");
  }

  async fillAddress(address: string) {
    await this.getAddressInput().fill(address);
  }

  getCityInput() {
    return this.page.locator("#city");
  }

  async fillCity(city: string) {
    await this.getCityInput().fill(city);
  }

  getTelephoneInput() {
    return this.page.locator("#telephone");
  }

  async fillTelephone(telephone: string) {
    await this.getTelephoneInput().fill(telephone);
  }

  getAddOwnerButton() {
    return this.page.locator('a.btn.btn-primary[href="/owners/new"]');
  }

  async clickAddOwner() {
    await this.getAddOwnerButton().click();
  }

  getSubmitOwnerButton() {
    return this.page.locator('button[type="submit"].btn.btn-primary');
  }

  async clickSubmitOwner() {
    await this.getSubmitOwnerButton().click();
  }
import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class OwnerSearchPage extends BasePage {
  getLastNameInput() {
    return this.page.locator("#lastName");
  }

  async fillLastName(name: string) {
    await this.getLastNameInput().fill(name);
  }

  getFindOwnerButton() {
    return this.page.getByRole("button", { name: /Find Owner/ });
  }

  async clickFindOwner() {
    await this.getFindOwnerButton().click();
  }

  getOwnerInfoHeader() {
    return this.page.getByRole("heading", { name: /Owner Information/ });
  }

  getOwnerName() {
    return this.page.locator("td b").first();
  }

  getAddress() {
    return this.page.locator('tr:has(th:text("Address")) td');
  }

  getCity() {
    return this.page.locator('tr:has(th:text("City")) td');
  }

  getTelephone() {
    return this.page.locator('tr:has(th:text("Telephone")) td');
  }

  getPetSection(pet: string) {
    return this.page.locator("dl.dl-horizontal").filter({ hasText: pet });
  }
}
