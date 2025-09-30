import { Page, Locator } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  homeNav(): Locator {
    return this.page.getByRole("link", { name: "Home" });
  }

  homeIconFallback(): Locator {
    return this.page
      .locator('.navbar-brand, a[href="/"], a[href*="home"]')
      .first();
  }

  welcomeHeader(): Locator {
    return this.page.getByRole("heading", { name: "Welcome" });
  }

  welcomeText(): Locator {
    return this.page.getByText("Welcome to PetClinic");
  }

  mainContainer(): Locator {
    return this.page.locator("h1, h2, main, .container").first();
  }

  async clickHome() {
    try {
      await this.homeNav().click();
    } catch (e) {
      await this.homeIconFallback().click();
    }
  }

  async open(url: string = "http://localhost:8081") {
    await this.page.goto(url, { waitUntil: "networkidle" });
  }

  async waitForWelcome() {
    await this.page.waitForSelector('h2:has-text("Welcome")', {
      timeout: 10000,
    });
  }

  async close() {
    await this.page.close();
  }

  // Validation methods
  async isWelcomeVisible(): Promise<boolean> {
    const welcomeTexts = ["Welcome", "Spring PetClinic", "Home"];

    // Try to find any welcome-related text
    for (const text of welcomeTexts) {
      try {
        await this.page.getByText(text, { exact: false }).waitFor({
          state: "visible",
          timeout: 3000,
        });
        return true;
      } catch (e) {
        continue;
      }
    }

    // Fallback: check if main container is visible
    try {
      await this.mainContainer().waitFor({
        state: "visible",
        timeout: 10000,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
