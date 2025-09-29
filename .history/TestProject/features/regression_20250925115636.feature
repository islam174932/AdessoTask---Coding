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
      | firstName | lastName | address      | city        | telephone   |
      | Bob       | Brown    | 789 Pine Rd. | Capital City| 5551112222  |
      | Islam     | Ibrahim  | 000 Pine Rd. | Cairo       | 5551234567  |

  Scenario Outline: Search for newly added owner and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "<lastName>" in the search field
    And I click the Find Owner button
    Then I should see the owner "<firstName> <lastName>" with address "<address>", city "<city>", and telephone "<telephone>" in the owners table

    Examples:
      | firstName | lastName | address      | city        | telephone   |
      | Bob       | Brown    | 789 Pine Rd. | Capital City| 5551112222  |
      | Islam     | Ibrahim  | 000 Pine Rd. | Cairo       | 5551234567  |

  Scenario Outline: Update existing owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "<lastName>" in the search field
    And I click the Find Owner button
    And I click the owner link "<firstName> <lastName>" with address "<address>"
    And I click the Edit Owner button
    And I update owner details:
      | firstName | lastName | address      | city        | telephone   |
      | <newFirstName> | <newLastName> | <newAddress> | <newCity> | <newTelephone> |
    And I submit the Update Owner form
    Then I should see the updated owner "<newFirstName> <newLastName>" with address "<newAddress>", city "<newCity>", and telephone "<newTelephone>"

    Examples:
      | firstName | lastName | address      | city        | telephone   | newFirstName | newLastName | newAddress    | newCity | newTelephone |
      | Bob       | Brown    | 789 Pine Rd. | Capital City| 5551112222  | Islam        | Ibrahim     | 000 Pine Rd.  | Cairo   | 5551234567   |
    And I submit the Update Owner form
    Then I should see the updated owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "010325655"
    And I submit the Update Owner form
    Then I should see the updated owner "Robert Browning" with address "789 Pine Rd.", city "Capital City", and telephone "5551112222"

