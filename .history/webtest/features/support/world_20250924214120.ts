import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

export class CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
