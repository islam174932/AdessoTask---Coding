Feature: Spring PetClinic Home Smoke Test
  As a user
  I want to verify the Home icon works
  So that the application is healthy

  Scenario: Home icon is visible, clickable, and loads Welcome
    Given I am on the home page
    Then I should see the Home icon
    When I click the Home icon
    Then I should see the Welcome header
