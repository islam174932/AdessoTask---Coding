import { Before, After } from "@cucumber/cucumber";
import { chromium, Browser } from "playwright";
import { CustomWorld } from "./world.ts";

let browser: Browser;

Before(async function (this: CustomWorld) {
  if (!browser) {
    browser = await chromium.launch({ headless: false, slowMo: 1000 }); // 1 second delay between actions
  }
  this.page = await browser.newPage();
});

After(async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
  }
});
