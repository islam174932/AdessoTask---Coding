Feature: Application Regression Test



  Scenario Outline: Add a new owner
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details:
      | firstName | lastName | address      | city        | telephone   |
      | <firstName> | <lastName> | <address> | <city> | <telephone> |
    And I submit the Add Owner form
    Then I should see the new owner added

    Examples:
      | firstName | lastName | address         | city         | telephone   |
      | Bob       | Brown    | 789 Pine Rd.    | Capital City | 5551112222  |
      | John      | Doe      | 123 Main St.    | Springfield  | 5551234567  |
      | Alice     | Smith    | 456 Oak Ave.    | Shelbyville  | 5559876543  |
      | Carol     | White    | 321 Birch Blvd. | Lakeview     | 5552223333  |


  Scenario Outline: Search for newly added owner and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "<lastName>" in the search field
    And I click the Find Owner button
    Then I should see the owner "<firstName> <lastName>" with address "<address>", city "<city>", and telephone "<telephone>" in the owners table

    Examples:
      | firstName | lastName | address         | city         | telephone   |
      | Bob       | Brown    | 789 Pine Rd.    | Capital City | 5551112222  |
      | John      | Doe      | 123 Main St.    | Springfield  | 5551234567  |
      | Alice     | Smith    | 456 Oak Ave.    | Shelbyville  | 5559876543  |
      | Carol     | White    | 321 Birch Blvd. | Lakeview     | 5552223333  |

