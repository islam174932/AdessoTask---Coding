import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  homeNav() {
    return this.page.getByRole("link", { name: "Home" });
  }

  async clickHome() {
    await this.homeNav().click();
  }

  welcomeHeader() {
    return this.page.getByRole("heading", { name: "Welcome" });
  }

  async isWelcomeVisible() {
    return await this.welcomeHeader().isVisible();
  }

  welcomeText() {
    return this.page.getByText("Welcome to PetClinic");
  }

  async open() {
    await this.page.goto("http://localhost:8081", { waitUntil: "networkidle" });
  }

  async waitForWelcome() {
    await this.page.waitForSelector('h2:has-text("Welcome")', {
      timeout: 10000,
    });
  }
}
