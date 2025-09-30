import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext } from "playwright";
import { CustomWorld } from "./world";

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  const isHeadless = process.env.HEADLESS === "true";

  console.log("🚀 Browser mode - Headless:", isHeadless);

  browser = await chromium.launch({
    headless: isHeadless,
    slowMo: isHeadless ? 0 : 100, // ✅ Added missing comma
    args: ["--start-maximized", "--window-size=1366,768"],
  });

  // ✅ Added the missing context initialization
  context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    screen: { width: 1366, height: 768 },
  });
});

Before(async function (this: CustomWorld) {
  this.page = await context.newPage();
});

After(async function (this: CustomWorld, { result }) {
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
