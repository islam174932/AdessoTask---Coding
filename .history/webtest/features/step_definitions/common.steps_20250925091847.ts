import { Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";

Given("I am on the home page", async function (this: CustomWorld) {
  await this.page!.goto("http://localhost:8081");
});

When("I click the Find Owners icon", async function (this: CustomWorld) {
  await this.page!.getByRole("link", { name: "Find owners" }).click();
});
