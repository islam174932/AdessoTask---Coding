Feature: Application Smoke Test
  As a user
  I want to verify the main navigation and health of the application
  So that I know the app is up and running

  Scenario: Home navigation works and Welcome is shown
    Given I open the home page
    When I click the Home icon
    Then I should see the Welcome header
