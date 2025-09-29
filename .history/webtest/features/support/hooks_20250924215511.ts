import { Before, After, setDefaultTimeout, AfterStep } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "./world";

setDefaultTimeout(60 * 1000);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});


After(async function (this: CustomWorld) {
  await this.page!.close();
  await this.context!.close();
  await this.browser!.close();
});

// Add a delay after each step for better visibility
AfterStep(async function () {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // 1.2 seconds
});
