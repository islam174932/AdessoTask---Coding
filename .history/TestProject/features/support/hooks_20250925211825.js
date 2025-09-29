const { Before, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { CustomWorld } = require("./world.js");

let browser;

Before(async function () {
  if (!browser) {
    browser = await chromium.launch();
  }
  this.page = await browser.newPage();
});

After(async function () {
  if (this.page) {
    await this.page.close();
  }
});
