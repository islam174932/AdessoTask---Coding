const { setWorldConstructor } = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const { HomePage } = require("../../src/pages/HomePage.ts");
const { OwnersPage } = require("../../src/pages/OwnersPage.ts");
const { AddOwnerPage } = require("../../src/pages/AddOwnerPage.ts");
const { VetsPage } = require("../../src/pages/VetsPage.ts");
const { ErrorPage } = require("../../src/pages/ErrorPage.ts");

class CustomWorld {
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
    this.lastPet = undefined;
    this.lastVisit = undefined;
    this.updatedOwner = undefined;
  }

  async init() {
    this.browser = await chromium.launch({ headless: false, slowMo: 800 });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.homePage = new HomePage(this.page);
    this.ownersPage = new OwnersPage(this.page);
    this.vetsPage = new VetsPage(this.page);
    this.errorPage = new ErrorPage(this.page);
  }

  async close() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
module.exports = { CustomWorld };
