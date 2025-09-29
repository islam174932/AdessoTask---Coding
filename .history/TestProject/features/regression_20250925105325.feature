Feature: Application Regression Test

  Scenario: Add a new owner
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details:
      | firstName  | lastName | address         | city        | telephone   |
      | John       | Doe      | 123 Main St.    | Springfield | 5551234567  |
    And I submit the Add Owner form
    Then I should see the new owner added
