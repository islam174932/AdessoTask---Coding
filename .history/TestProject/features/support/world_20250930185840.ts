import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "playwright";

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  ownersPage?: any;
  addOwnerPage?: any;
  homePage?: any;
  petPage?: any;
  visitPage?: any;
  alertPage?: any;
  lastOwner?: any;
  lastPetName?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    // Read HEADLESS environment variable
    const isHeadless = process.env.HEADLESS === "true";

    console.log("🚀 Browser mode - Headless:", isHeadless);

    this.browser = await chromium.launch({
      headless: isHeadless, // true = hidden, false = visible
      slowMo: isHeadless ? 0 : 50,
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    this.page = await this.context.newPage();
  }

  async cleanup() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
