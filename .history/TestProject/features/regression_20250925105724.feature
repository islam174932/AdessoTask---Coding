Feature: Application Regression Test

  Scenario Outline: Add a new owner
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details:
      | firstName  | lastName | address         | city        | telephone   |
      | <firstName> | <lastName> | <address> | <city> | <telephone> |
    And I submit the Add Owner form
    Then I should see the new owner added

    Examples:
      | firstName | lastName | address        | city        | telephone   |
      | John      | Doe      | 123 Main St.   | Springfield | 5551234567  |
      | Alice     | Smith    | 456 Oak Ave.   | Shelbyville | 5559876543  |
