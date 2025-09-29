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

Before(function () {
  return this.init();
});

After(function (this: CustomWorld, scenario) {
  if (scenario.result?.status === "FAILED") {
    if (this.page) {
      const screenshotPath = `screenshots/${scenario.pickle.name.replace(
        /\s+/g,
        "_"
      )}.png`;
      return this.page.screenshot({ path: screenshotPath }).then(() => this.close());
    }
  }
  if (this.page) {
    return this.page.waitForTimeout(10000).then(() => this.close());
  }
  return this.close();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
});
