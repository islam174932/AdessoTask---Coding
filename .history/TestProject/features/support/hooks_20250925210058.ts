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
  await this.init();
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
  await this.close();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
});
