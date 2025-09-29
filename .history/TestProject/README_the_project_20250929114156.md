# Product Owner Summary

As the programmer, I have implemented automated UI tests for Spring PetClinic using best practices:

**Page Object Model (POM):**
- All selectors and UI actions are defined once per page object class and reused everywhere, ensuring maintainability and DRY code.
- Example: Instead of using locators directly in step definitions, methods like `addOwnerPage.addOwnerLink().click()` are called.

**Object-Oriented Programming (OOP):**
- Page objects are implemented as classes, encapsulating selectors and actions for each page.
- Step definitions interact with these classes, promoting code reuse and separation of concerns.
- Example: `const alertPage = new AlertPage(this.page!); await alertPage.validateNewOwnerCreated();`

**Test Data via JSON:**
- All test data (owners, pets, visits) is managed in JSON files for easy updates and scalability.

**How to Run the Tests:**
- Smoke tests: `npm run smoke`
- Regression tests: `npm run regression`
- All tests sequentially: `npm run test`
- Parallel tests: `npm run test:parallel`
- Headless mode: add `:headless` to any script (e.g., `npm run smoke:headless`)

This approach ensures robust, maintainable, and scalable test automation for the product.

# Project Overview: Automated Testing for Spring PetClinic

## What Was Implemented

As the programmer, I have built a robust automated test suite for the Spring PetClinic application using the following principles and technologies:

### 1. Page Object Model (POM)

- All page interactions are encapsulated in dedicated page classes (e.g., `OwnersPage`, `AddOwnerPage`, `HomePage`).
- Step definitions use these page objects for all UI actions, ensuring maintainability and reusability.

### 2. Object-Oriented Programming (OOP)

- I designed page classes with constructors, encapsulating selectors and actions for each page.
- I use inheritance and composition where needed (e.g., base page classes or utility classes).
- The `CustomWorld` class manages scenario context and state, demonstrating encapsulation.
- I reuse methods across page objects, such as navigation, form filling, and validation, to avoid duplication.
- Example: The `OwnersPage` and `AddOwnerPage` classes each provide methods like `findOwnersNav()`, `lastNameInput()`, and `addOwnerButton()`, which are called from step definitions rather than using raw selectors.
- Example: All page objects are instantiated with the Playwright `page` object, showing constructor usage and dependency injection.

### 3. JSON Data Usage

- Test data (owners, pets, visits) is stored in a JSON file (`testdata.json`).
- Step definitions read from this file to fill forms and validate data, enabling easy data management and test scalability.

## Test Coverage

### Smoke Tests

- **Home navigation and Welcome header**
- **Find Owners search**
- **Veterinarians table and pagination**
- **Error page display**

### Regression Tests

- **Search for an owner**
- **Add a new owner**
- **Add a new pet to an owner**
- **Add a visit to a pet**
- **Update owner details**

All required functionalities (search owner, add owner, add pet, add visit) are covered by my regression test cases.

## Frameworks and Languages Used

- **Programming Language:** TypeScript
- **Test Frameworks:** Cucumber (BDD), Playwright
- **Runner:** Cucumber.js with ts-node for TypeScript support

## How to Run the Tests

### 1. Run Smoke Tests

```sh
npm run smoke
```

### 2. Run Regression Tests

```sh
npm run regression
```

### 3. Run All Tests (Smoke + Regression)

```sh
npm test
```

### 4. Run Tests in Parallel (if script exists)

```sh
npm run test:parallel
```

## Error Handling and Screenshots

Whenever a test encounters an error, a screenshot is automatically captured and saved in the `screenshots` directory for debugging purposes.

Example location: `D:\AdessoTask - Copy\TestProject\screenshots\`

## Summary

- I have implemented a maintainable, scalable, and robust test suite using POM and OOP principles.
- Test data is managed via JSON for flexibility.
- All core and edge functionalities are covered by smoke and regression tests.
- The project uses modern frameworks and TypeScript for reliability and developer experience.

---

_For any further instructions or troubleshooting, refer to the comments in the step definition and page object files._
