Feature: Application Smoke Test
  As a user
  I want to verify the main navigation and health of the application
  So that I know the app is up and running

  Scenario: Home page loads successfully
    Given I open the home page
    Then I should see the Welcome header
