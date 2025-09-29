import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly logoSelector = 'img[src*="spring-logo"]';

  async goto() {
    await this.page.goto("http://localhost:8081/");
  }

  async isLogoVisible() {
    return this.page.isVisible(this.logoSelector);
  }

  getHomeNav() {
    return this.page.getByRole("link", { name: /Home/ });
  }

  async clickHome() {
    await this.getHomeNav().click();
  }

  getFindOwnersNav() {
    return this.page.getByRole("link", { name: /Find Owners/ });
  }

  async clickFindOwners() {
    await this.getFindOwnersNav().click();
  }

  getVeterinariansNav() {
    return this.page.getByRole("link", { name: /Veterinarians/ });
  }

  async clickVeterinarians() {
    await this.getVeterinariansNav().click();
  }

  getErrorNav() {
    return this.page.getByRole("link", { name: /Error/ });
  }

  async clickError() {
    await this.getErrorNav().click();
  }
}
