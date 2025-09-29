import { setWorldConstructor } from "@cucumber/cucumber";
import { Browser, Page, chromium, BrowserContext } from "@playwright/test";
import type { HomePage } from "../../src/pages/HomePage.ts";

export class CustomWorld {
  browser: Browser | undefined;
  context: BrowserContext | undefined;
  page: Page | undefined;
  homePage: HomePage | undefined;
  ownersPage: import("../../src/pages/OwnersPage.ts").OwnersPage | undefined;
  addOwnerPage: import("../../src/pages/AddOwnerPage.ts").AddOwnerPage | undefined;
  vetsPage: import("../../src/pages/VetsPage.ts").VetsPage | undefined;
  errorPage: import("../../src/pages/ErrorPage.ts").ErrorPage | undefined;
  lastOwner: any;

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

  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: false, slowMo: 800 });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async close(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
