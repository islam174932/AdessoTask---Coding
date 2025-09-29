class HomePage {
  constructor(page) {
    this.page = page;
  }
  welcomeText() {
    return this.page.getByText("Welcome to PetClinic");
  }
}
module.exports = { HomePage };
