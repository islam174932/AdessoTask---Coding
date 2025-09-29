import { World, IWorldOptions } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { OwnersPage } from "../../src/pages/OwnersPage";
import { AddOwnerPage } from "../../src/pages/AddOwnerPage";
import { PetPage } from "../../src/pages/PetPage";
import { VisitPage } from "../../src/pages/VisitPage";

export interface CustomWorld extends World {
  page?: Page;
  homePage?: HomePage;
  ownersPage?: OwnersPage;
  addOwnerPage?: AddOwnerPage;
  petPage?: PetPage; // Add this
  visitPage?: VisitPage; // Add this
}

export class CustomWorldImpl extends World implements CustomWorld {
  page?: Page;
  homePage?: HomePage;
  ownersPage?: OwnersPage;
  addOwnerPage?: AddOwnerPage;
  petPage?: PetPage; // Add this
  visitPage?: VisitPage; // Add this

  constructor(options: IWorldOptions) {
    super(options);
  }
}
