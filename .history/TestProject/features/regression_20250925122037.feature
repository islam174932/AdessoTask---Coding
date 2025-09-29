
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

      Scenario Outline: Add a new pet to an owner
        Given I open the home page
        When I click the Find Owners link
        And I enter last name "<lastName>" in the search field
        And I click the Find Owner button
        And I click the owner link "<firstName> <lastName>" with address "<address>"
        And I click the Add New Pet button
        And I enter pet details:
          | name     | birthDate   | type   |
          | <petName> | <birthDate> | <type> |
        And I submit the Add Pet form
        Then I should see the new pet "<petName>" with birth date "<birthDate>" and type "<type>" for owner "<firstName> <lastName>"

        Examples:
          | firstName | lastName | address      | petName | birthDate   | type   |
          | Bob       | Brown    | 789 Pine Rd. | Max     | 2023-01-01  | dog    |

