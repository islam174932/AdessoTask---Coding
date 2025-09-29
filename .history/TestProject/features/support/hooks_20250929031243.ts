import { Before, After } from "@cucumber/cucumber";
import { chromium, Browser } from "playwright";
import { CustomWorld } from "./world.ts";

let browser: Browser;

Before(async function (this: CustomWorld) {
  if (!browser) {
    browser = await chromium.launch({ headless: false, slowMo: 500 }); // Reduced delay
  }
  this.page = await browser.newPage();
});

After(async function (this: CustomWorld) {
  // Only close the page, keep browser open for next scenario
  if (this.page) {
    await this.page.close();
  }
});

// Add this to close browser completely at the end
After({ tags: "@regression" }, async function () {
  if (browser) {
    await browser.close();
    browser = null;
  }
});
