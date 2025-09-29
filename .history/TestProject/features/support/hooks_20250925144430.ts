import {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, chromium } from "playwright";
import { CustomWorld } from "./world.ts";

let browser: Browser | undefined;

// Set global step timeout to 30 seconds to prevent timeout errors
setDefaultTimeout(30000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false, slowMo: 500 }); // Headed mode, faster actions
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser!.newContext();
  this.page = await this.context.newPage();
  // Maximize window (set viewport to large size)
  await this.page.setViewportSize({ width: 1920, height: 1080 });
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === "FAILED") {
    if (this.page) {
      const screenshotPath = `screenshots/${scenario.pickle.name.replace(
        /\s+/g,
        "_"
      )}.png`;
      await this.page.screenshot({ path: screenshotPath });
    }
  }
  // Keep browser open for 10 seconds after each scenario for inspection
  if (this.page) {
    await this.page.waitForTimeout(10000);
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
