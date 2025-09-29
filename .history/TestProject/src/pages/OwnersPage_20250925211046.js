class OwnersPage {
  constructor(page) {
    this.page = page;
  }
  findOwnersNav() {
    return this.page.getByRole("link", { name: "Find owners" });
  }
  lastNameInput() {
    return this.page.locator('input[name="lastName"]');
  }
  findOwnerButton() {
    return this.page.getByRole("button", { name: "Find Owner" });
  }
  getOwnerRowByName(fullName) {
    return this.page.locator(`table#owners tbody tr:has(a:has-text('${fullName}'))`);
  }
}
module.exports = { OwnersPage };
