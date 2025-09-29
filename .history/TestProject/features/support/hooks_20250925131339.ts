import { After, Before } from '@cucumber/cucumber';
import { Browser, chromium } from 'playwright';
import fs from 'fs';

let browser: Browser;

Before(async function () {
  browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] });
  this.browser = browser;
  this.context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  // Cucumber status is scenario.result?.status === 'FAILED' (all caps)
  if (scenario.result?.status === 'FAILED') {
    if (this.page) {
      const screenshotPath = `screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`;
      await this.page.screenshot({ path: screenshotPath });
    }
    if (this.page && this.context) {
      const videoPath = await this.page.video()?.path();
      if (videoPath) {
        const dest = `videos/${scenario.pickle.name.replace(/\s+/g, '_')}.webm`;
        fs.renameSync(videoPath, dest);
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
