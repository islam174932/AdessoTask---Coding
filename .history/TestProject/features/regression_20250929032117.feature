
Feature: Application Regression Test

@regression
  Scenario Outline: Add a new owner
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details from json for index <ownerIndex>
    And I submit the Add Owner form
    Then I should see the new owner added

    Examples:
      | ownerIndex |
      | 0          |
      
@regression
  Scenario Outline: Search for newly added owner and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "<lastName>" in the search field
    And I click the Find Owner button
    Then I should see the owner "<firstName> <lastName>" with address "<address>", city "<city>", and telephone "<telephone>" in the owners table

    Examples:
      | firstName | lastName | address      | city        | telephone   |
        | Islam     | Ibrahim  | 000 Pine Rd. | Cairo       | 5551234567  |
#@regression
 Scenario: Update existing owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Ibrahim" in the search field
    And I click the Find Owner button
    And I click the owner link "Islam Ibrahim" with address "000 Pine Rd."
    And I click the Edit Owner button
    And I clear all owner fields
    And I update owner details from json for index 1
    And I submit the Update Owner form
    Then I should see the updated owner details

    Examples:
      | firstName | lastName | address      | city        | telephone   | newFirstName | newLastName | newAddress    | newCity | newTelephone |
      | Bob       | Ibrahim    | 789 Pine Rd. | Capital City| 5551112222  | Islam        | Ibrahim     | 000 Pine Rd.  | Cairo   | 5551234567   |
@regression
      Scenario Outline: Add a new pet to an owner
        Given I open the home page
        When I click the Find Owners link
        And I enter last name "<lastName>" in the search field
        And I click the Find Owner button
        And I click the owner link "<firstName> <lastName>" with address "<address>"
        And I click the Add New Pet button
        And I enter pet details from json for index 0
        And I submit the Add Pet form
        Then I should see the new pet "<petName>" with birth date "<birthDate>" and type "<type>" for owner "<firstName> <lastName>"


        Examples:
          | firstName | lastName | address      | petName | birthDate   | type   |
          | Bob       | Brown    | 789 Pine Rd. | Max     | 2023-01-01  | dog    |
#@regression
      Scenario Outline: Add a visit to a pet
        Given I open the home page
        When I click the Find Owners link
        And I enter last name "<lastName>" in the search field
        And I click the Find Owner button
        And I click the owner link "<firstName> <lastName>" with address "<address>"
        And I click the pet name link "<petName>"
        And I click the Add Visit button
        And I enter visit details from json for index 0
        And I submit the Add Visit form


        Examples:
          | firstName | lastName | address      | petName | date       | description         |
          | Bob       | Brown    | 789 Pine Rd. | Max     | 2025-09-25 | Annual checkup      |

