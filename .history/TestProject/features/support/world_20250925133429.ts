import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';

import type { BrowserContext } from 'playwright';
export class CustomWorld {
  browser: Browser | undefined;
  context: BrowserContext | undefined;
  page: Page | undefined;
  lastOwner?: any;

  constructor() {
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.lastOwner = undefined;
  }

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
