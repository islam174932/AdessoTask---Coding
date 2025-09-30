import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext } from "playwright";
import { CustomWorld } from "./world";

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  // Read HEADLESS environment variable
  const isHeadless = process.env.HEADLESS === "true";

  console.log("🚀 Browser mode - Headless:", isHeadless);

  browser = await chromium.launch({
    headless: isHeadless, // true = hidden, false = visible
    slowMo: isHeadless ? 0 : 100,
    args: ["--start-maximized", "--window-size=1920,1080"],
  });

  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
});

Before(async function (this: CustomWorld) {
  this.page = await context.newPage();
});

After(async function (this: CustomWorld, { result }) {
  // Take screenshot on failure
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }

  if (this.page) {
    await this.page.close();
  }
});

AfterAll(async function () {
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }
});
