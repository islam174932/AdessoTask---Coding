import { After, Before } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import { CustomWorld } from './world';
import fs from 'fs';

let browser: Browser;

Before(async function (this: CustomWorld) {
  browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
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
  }
  if (browser) {
    await browser.close();
  }
});
