import { Page, Locator, expect } from '@playwright/test';

export class ErrorPage {
  constructor(private readonly page: Page) {}

  errorNav(): Locator {
    return this.page.getByRole('link', { name: 'Error' });
  }

  errorHeader(): Locator {
    return this.page.getByRole('heading', { name: 'Something happened...' });
  }

  async clickErrorNav() {
    await this.errorNav().click();
  }

  async isErrorHeaderVisible() {
    return await this.errorHeader().isVisible();
  }
}
