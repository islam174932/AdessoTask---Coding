import { After, Before, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import { CustomWorld } from './world.ts';


let browser: Browser | undefined;


BeforeAll(async function () {
  browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});


After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    if (this.page) {
      const screenshotPath = `screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`;
      await this.page.screenshot({ path: screenshotPath });
    }
  }
  if (this.context) {
    await this.context.close();
    this.context = undefined;
  }
  if (this.page) {
    this.page = undefined;
  }
  this.browser = undefined;
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
});
