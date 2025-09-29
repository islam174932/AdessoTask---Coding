import { Before, After, BeforeAll, AfterAll } from "@cucumber/cucumber";
import { chromium, Browser } from "playwright";
import { CustomWorld } from "./world.ts";

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false, slowMo: 500 });
});

Before(async function (this: CustomWorld) {
  this.page = await browser.newPage();
});

After(async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
