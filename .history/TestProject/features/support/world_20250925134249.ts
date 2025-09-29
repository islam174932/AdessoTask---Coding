import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';
import type { HomePage } from '../../src/pages/HomePage.ts';

import type { BrowserContext } from 'playwright';
export class CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  homePage?: HomePage;
  ownersPage?: import('../../src/pages/OwnersPage.ts').OwnersPage;
  vetsPage?: import('../../src/pages/VetsPage.ts').VetsPage;
  errorPage?: import('../../src/pages/ErrorPage.ts').ErrorPage;
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
setWorldConstructor(CustomWorld);
