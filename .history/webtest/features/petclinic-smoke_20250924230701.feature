Feature: Spring PetClinic Home Smoke Test
  As a user
  I want to verify the Home and Find Owners icons work
  So that the application is healthy

  Scenario: Home icon is visible, clickable, and loads Welcome
    Given I am on the home page
    Then I should see the Home icon
    When I click the Home icon
    Then I should see the Welcome header

  Scenario: Find Owners icon is visible, clickable, and loads Find Owners
    Given I am on the home page
    Then I should see the Find Owners icon
    When I click the Find Owners icon
    Then I should see the Find Owners header

  Scenario: Veterinarians icon is visible, clickable, and loads Veterinarians
    Given I am on the home page
    Then I should see the Veterinarians icon
    When I click the Veterinarians icon
    Then I should see the Veterinarians header


