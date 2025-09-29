import { Given, When } from "@cucumber/cucumber";

Given("I am on the home page", async function () {
  await this.page!.goto("http://localhost:8081");
});

When("I click the Find Owners icon", async function () {
  await this.page!.getByRole("link", { name: "Find owners" }).click();
});
