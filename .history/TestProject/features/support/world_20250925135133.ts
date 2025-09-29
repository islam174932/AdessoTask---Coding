import { setWorldConstructor } from "@cucumber/cucumber";
import { Browser, Page, chromium, BrowserContext } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage.js"; // Note: .js extension for ES modules
import { OwnersPage } from "../../src/pages/OwnersPage.js";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage.js";
import { VetsPage } from "../../src/pages/VetsPage.js";
import { ErrorPage } from "../../src/pages/ErrorPage.js";

export class CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  homePage?: HomePage;
  ownersPage?: OwnersPage;
  addOwnerPage?: AddOwnerPage;
  vetsPage?: VetsPage;
  errorPage?: ErrorPage;
  lastOwner?: any;

  constructor() {
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.homePage = undefined;
    this.ownersPage = undefined;
  this.addOwnerPage = undefined;
  this.vetsPage = undefined;
  this.errorPage = undefined;
  this.lastOwner = undefined;
  }

  async init() {
    this.browser = await chromium.launch({ headless: false, slowMo: 800 });
    this.context = await this.browser.newContext(); // Initialize context
    this.page = await this.context.newPage(); // Create page from context

    // Initialize page objects
    this.homePage = new HomePage(this.page);
    this.ownersPage = new OwnersPage(this.page);
    this.vetsPage = new VetsPage(this.page);
    this.errorPage = new ErrorPage(this.page);
  }

  async close() {
    await this.page?.close();
    await this.context?.close(); // Close context too
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld); // Only once!
