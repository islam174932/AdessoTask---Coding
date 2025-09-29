import { After, Before } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import fs from 'fs';

let browser: Browser;

Before(async function () {
  browser = await chromium.launch({ headless: true, args: ['--disable-gpu'], recordVideo: { dir: 'videos/' } });
  this.browser = browser;
  this.context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === 'failed') {
    if (this.page) {
      const screenshotPath = `screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`;
      await this.page.screenshot({ path: screenshotPath });
    }
    if (this.context) {
      const video = await this.page.video();
      if (video) {
        await video.saveAs(`videos/${scenario.pickle.name.replace(/\s+/g, '_')}.webm`);
      }
    }
  }
  if (this.context) {
    await this.context.close();
  }
  if (browser) {
    await browser.close();
  }
});
