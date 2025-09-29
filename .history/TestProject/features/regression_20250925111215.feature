Feature: Application Regression Test


  Scenario: Add a new owner (single data)
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details:
      | firstName | lastName | address      | city        | telephone   |
      | Bob       | Brown    | 789 Pine Rd. | Capital City| 5551112222  |
    And I submit the Add Owner form
    Then I should see the new owner added

    Scenario: Search for newly added owner and validate in owners table
      Given I open the home page
      When I click the Find Owners link
      And I enter last name "Brown" in the search field
      And I click the Find Owner button
      Then I should see the owner "Bob Brown" with address "789 Pine Rd.", city "Capital City", and telephone "5551112222" in the owners table

  Scenario Outline: Add a new owner (multiple data)
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details:
      | firstName  | lastName | address      | city        | telephone   |
      | <firstName> | <lastName> | <address> | <city> | <telephone> |
    And I submit the Add Owner form
    Then I should see the new owner added

    Examples:
      | firstName | lastName | address        | city        | telephone   |
      | John      | Doe      | 123 Main St.   | Springfield | 5551234567  |
      | Alice     | Smith    | 456 Oak Ave.   | Shelbyville | 5559876543  |
