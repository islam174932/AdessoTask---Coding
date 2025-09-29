import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly logoSelector = 'img[src*="spring-logo"]';
  readonly homeNavSelector = "a.navbar-brand";
  readonly findOwnersNavSelector = 'a[href="/owners/find"]';
  readonly veterinariansNavSelector = 'a[href="/vets"]';
  readonly errorNavSelector = 'a[href="/oups"]';

  async goto() {
    await this.page.goto("http://localhost:8081/");
  }

  async isLogoVisible() {
    return this.page.isVisible(this.logoSelector);
  }

  async clickHome() {
    await this.page.click(this.homeNavSelector);
  }

  async clickFindOwners() {
    await this.page.click(this.findOwnersNavSelector);
  }

  async clickVeterinarians() {
    await this.page.click(this.veterinariansNavSelector);
  }

  async clickError() {
    await this.page.click(this.errorNavSelector);
  }
}
