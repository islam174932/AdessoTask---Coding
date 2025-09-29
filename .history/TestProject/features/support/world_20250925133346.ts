import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';

export class CustomWorld {
  browser!: Browser;
  context!: any;
  page!: Page;
  lastOwner?: any;

  async init() {
    this.browser = await chromium.launch({ headless: false, slowMo: 800 }); // Show browser and slow down actions
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.page?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
