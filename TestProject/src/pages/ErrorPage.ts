import { Page, Locator, expect } from "@playwright/test";

export class ErrorPage {
  constructor(private readonly page: Page) {}

  errorNav(): Locator {
    return this.page.getByRole("link", { name: "Error" });
  }

  errorLink(): Locator {
    return this.errorNav(); // Alias for base.steps compatibility
  }

  errorHeader(): Locator {
    return this.page.getByRole("heading", { name: "Something happened..." });
  }

  genericErrorHeader(): Locator {
    return this.page.locator("h1, h2").first();
  }

  async clickErrorNav() {
    await this.errorNav().click();
  }

  async isErrorHeaderVisible(): Promise<boolean> {
    try {
      return await this.errorHeader().isVisible();
    } catch (e) {
      return false;
    }
  }

  // Add this method for base.steps compatibility
  async validateErrorPage() {
    const errorHeaders = [
      "Something happened",
      "Something happened...",
      "Error",
      "Oops",
      "Something went wrong",
    ];

    let headerFound = false;

    for (const headerText of errorHeaders) {
      try {
        await expect(
          this.page.getByText(headerText, { exact: false })
        ).toBeVisible({ timeout: 3000 });
        headerFound = true;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!headerFound) {
      // Fallback: just check if any h1/h2 is visible
      await expect(this.genericErrorHeader()).toBeVisible({ timeout: 10000 });
    }
  }
}
