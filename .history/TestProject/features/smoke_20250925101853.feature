Feature: Application Smoke Test
  As a user
  I want to verify the main navigation and health of the application
  So that I know the app is up and running

  Scenario: Home navigation works and Welcome is shown
    Given I open the home page
    When I click the Home icon
    Then I should see the Welcome header

  Scenario: Find Owners search returns correct results
    Given I open the home page
    When I click the Find Owners link
    And I enter "Davis" in the last name field
    And I click the Find Owner button
    Then I should see the Owners table with correct Davis entries

  Scenario: Veterinarians table and pagination
    Given I open the home page
    When I click the Veterinarians link
    Then I should see the Veterinarians table with correct data
    And I should be able to click the Next page link
