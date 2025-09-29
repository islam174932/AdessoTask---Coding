import { Page, Locator, expect } from "@playwright/test";

export class VetsPage {
  constructor(private readonly page: Page) {}

  vetsNav(): Locator {
    return this.page.getByRole("link", { name: "Veterinarians" });
  }

  vetsTable(): Locator {
    return this.page.locator("table#vets");
  }

  vetRows(): Locator {
    return this.vetsTable().locator("tbody tr");
  }

  getVetRowByName(name: string): Locator {
    return this.vetRows().filter({ hasText: name });
  }

  nextPageLink(): Locator {
    return this.page.locator('a.fa-step-forward[title="Next"]');
  }

  async validateVetsTable() {
    // Validate each vet and specialties
    await expect(
      this.getVetRowByName("James Carter").getByText("none")
    ).toBeVisible();
    await expect(
      this.getVetRowByName("Helen Leary").getByText("radiology")
    ).toBeVisible();
    await expect(
      this.getVetRowByName("Linda Douglas").getByText("dentistry")
    ).toBeVisible();
    await expect(
      this.getVetRowByName("Linda Douglas").getByText("surgery")
    ).toBeVisible();
    await expect(
      this.getVetRowByName("Rafael Ortega").getByText("surgery")
    ).toBeVisible();
    await expect(
      this.getVetRowByName("Henry Stevens").getByText("radiology")
    ).toBeVisible();
  }

  async clickNextPage() {
    await this.nextPageLink().click();
  }
}
