import { Page, Locator, expect } from "@playwright/test";

export class VetsPage {
  constructor(private readonly page: Page) {}

  vetsNav(): Locator {
    return this.page.getByRole("link", { name: "Veterinarians" });
  }

  veterinariansLink(): Locator {
    return this.vetsNav();
  }

  vetsTable(): Locator {
    return this.page.locator("table#vets");
  }

  veterinariansTable(): Locator {
    return this.page.locator("table");
  }

  vetRows(): Locator {
    return this.vetsTable().locator("tbody tr");
  }

  veterinarianRows(): Locator {
    return this.page.locator("table tbody tr");
  }

  getVetRowByName(name: string): Locator {
    return this.vetRows().filter({ hasText: name });
  }

  nextPageLink(): Locator {
    return this.page.locator('a.fa-step-forward[title="Next"]');
  }

  nameHeader(): Locator {
    return this.page.getByText("Name");
  }

  specialtiesHeader(): Locator {
    return this.page.getByText("Specialties");
  }

  specialtyHeader(): Locator {
    return this.page.getByText("Specialty");
  }

  async validateVetsTable() {
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

  async validateVeterinariansTable() {
    await this.page.waitForSelector("table", {
      state: "visible",
      timeout: 10000,
    });

    await expect(this.nameHeader()).toBeVisible();

    const specialtyHeaders = ["Specialties", "Specialty"];
    let headerFound = false;

    for (const header of specialtyHeaders) {
      try {
        await expect(this.page.getByText(header)).toBeVisible({
          timeout: 2000,
        });
        headerFound = true;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!headerFound) {
      throw new Error("Neither 'Specialties' nor 'Specialty' header found");
    }

    await expect(this.veterinarianRows().first()).toBeVisible({
      timeout: 10000,
    });
  }

  async waitForTableLoad() {
    await this.page.waitForSelector("table", {
      state: "visible",
      timeout: 10000,
    });
  }

  async clickNextPage() {
    await this.nextPageLink().click();
  }
}
