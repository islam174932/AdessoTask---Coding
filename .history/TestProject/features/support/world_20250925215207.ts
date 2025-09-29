import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Page } from "playwright";

export class CustomWorld extends World {
  page?: Page;
  ownersPage?: any;
  addOwnerPage?: any;
  homePage?: any;
  lastOwner?: any;
  lastPetName?: string;
}

setWorldConstructor(CustomWorld);
