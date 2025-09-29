export class HomePage {
  constructor(private readonly page: import('playwright').Page) {}

  homeNav() {
    // Use getByRole for better uniqueness
    return this.page.getByRole("link", { name: "Home" });
  }

  async clickHome() {
    await this.homeNav().click();
  }

  welcomeHeader() {
    // Use getByRole for heading
    return this.page.getByRole("heading", { name: "Welcome" });
  }

  async isWelcomeVisible() {
    return await this.welcomeHeader().isVisible();
  }

  welcomeText() {
    return this.page.getByText("Welcome to PetClinic");
  }
}
