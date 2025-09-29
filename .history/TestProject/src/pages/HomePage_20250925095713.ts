import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  homeNav() {
    return this.page.locator('a.nav-link.active[title="home page"]');
  }

  async clickHome() {
    await this.homeNav().click();
  }

  welcomeHeader() {
    return this.page.locator('h2', { hasText: 'Welcome' });
  }

  async isWelcomeVisible() {
    return await this.welcomeHeader().isVisible();
  }
}
