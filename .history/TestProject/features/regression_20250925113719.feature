Feature: Application Regression Test

  Scenario: Add a new owner
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

  Scenario: Update existing owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Brown" in the search field
    And I click the Find Owner button
    And I click the owner link "Bob Brown" with address "789 Pine Rd."
    And I click the Edit Owner button
    And I update owner details:
      | firstName | lastName | address      | city        | telephone   |
      | Robert    | Browning | 789 Pine Rd. | Capital City| 5551112222  |
    And I submit the Update Owner form
    Then I should see the updated owner "Robert Browning" with address "789 Pine Rd.", city "Capital City", and telephone "5551112222"

  Scenario Outline: Update an existing owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "<lastName>" in the search field
    And I click the Find Owner button
    And I click the Edit Owner button
    And I update owner details:
      | firstName     | lastName     | address        | city         | telephone   |
      | <newFirstName> | <newLastName> | <newAddress> | <newCity> | <newTelephone> |
    And I submit the Update Owner form
    Then I should see the updated owner "<newFirstName> <newLastName>" with address "<newAddress>", city "<newCity>", and telephone "<newTelephone>"

    Examples:
      | lastName | firstName | newFirstName | newLastName | newAddress      | newCity      | newTelephone |
      | Brown    | Bob       | Robert       | Browning    | 789 Pine Rd.    | Capital City | 5551112222   |





  Scenario: Add a new owner
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

