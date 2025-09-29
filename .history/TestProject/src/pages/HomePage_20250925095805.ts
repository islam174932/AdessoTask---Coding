import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  homeNav() {
    // Use getByRole for better uniqueness
    return this.page.getByRole('link', { name: 'Home' });
  }

  async clickHome() {
    await this.homeNav().click();
  }

  welcomeHeader() {
    // Use getByRole for heading
    return this.page.getByRole('heading', { name: 'Welcome' });
  }

  async isWelcomeVisible() {
    return await this.welcomeHeader().isVisible();
  }
}
