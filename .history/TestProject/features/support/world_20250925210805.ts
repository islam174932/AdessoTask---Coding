import { setWorldConstructor, World } from "@cucumber/cucumber";
import { chromium, Page } from "playwright";
import { HomePage } from "../../src/pages/HomePage.ts";
import { OwnersPage } from "../../src/pages/OwnersPage.ts";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage.ts";

export class CustomWorld extends World {
  page?: Page;
  ownersPage?: OwnersPage;
  addOwnerPage?: AddOwnerPage;
  homePage?: HomePage;
  lastOwner?: any;
  lastPet?: any;
  lastVisit?: any;
  updatedOwner?: any;

  async init() {
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const context = await browser.newContext();
    this.page = await context.newPage();
    this.homePage = new HomePage(this.page);
    this.ownersPage = new OwnersPage(this.page);
    this.addOwnerPage = new AddOwnerPage(this.page);
  }

  async close() {
    await this.page?.close();
    await this.page?.context()?.close();
    await this.page?.context()?.browser()?.close();
  }
}

setWorldConstructor(CustomWorld);
