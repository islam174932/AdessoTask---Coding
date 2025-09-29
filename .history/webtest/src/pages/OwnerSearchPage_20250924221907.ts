import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class OwnerSearchPage extends BasePage {
  getLastNameInput() {
    return this.page.getByLabel("Last Name");
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
    return this.page.locator('dl.dl-horizontal').filter({ hasText: pet });
  }
}
