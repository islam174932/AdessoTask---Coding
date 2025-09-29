import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Page, Browser, chromium } from "playwright";

export class CustomWorld extends World {
  page?: Page;
  browser?: Browser;
  ownersPage?: any;
  addOwnerPage?: any;
  homePage?: any;
  petPage?: any; // Add this
  visitPage?: any; // Add this
  lastOwner?: any;
  lastPetName?: string;

  async init() {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  async cleanup() {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
