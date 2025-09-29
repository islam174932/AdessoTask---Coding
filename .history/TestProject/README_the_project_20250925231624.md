# Project Overview: Automated Testing for Spring PetClinic

## What Was Implemented

As the programmer, you have built a robust automated test suite for the Spring PetClinic application using the following principles and technologies:

### 1. Page Object Model (POM)
- All page interactions are encapsulated in dedicated page classes (e.g., `OwnersPage`, `AddOwnerPage`, `HomePage`).
- Step definitions use these page objects for all UI actions, ensuring maintainability and reusability.

### 2. Object-Oriented Programming (OOP)
- Page classes use constructors and encapsulate selectors and actions.
- The `CustomWorld` class is used for scenario context and state management.
- All reusable logic is centralized in page objects and support classes.

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

All required functionalities (search owner, add owner, add pet, add visit) are covered by your regression test cases.

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

## Summary
- You have implemented a maintainable, scalable, and robust test suite using POM and OOP principles.
- Test data is managed via JSON for flexibility.
- All core and edge functionalities are covered by smoke and regression tests.
- The project uses modern frameworks and TypeScript for reliability and developer experience.

---
*For any further instructions or troubleshooting, refer to the comments in the step definition and page object files.*
