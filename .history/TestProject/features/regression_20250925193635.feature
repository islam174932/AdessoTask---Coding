
Feature: Application Regression Test


  Scenario: Add a new owner (Bob Brown)
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I load owner data from "owner1.json"
    And I enter loaded owner details
    And I submit the Add Owner form
    Then I should see the new owner added

  Scenario: Add a new owner (Islam Ibrahim)
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I load owner data from "owner2.json"
    And I enter loaded owner details
    And I submit the Add Owner form
    Then I should see the new owner added

  Scenario: Search for newly added owner Bob Brown and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Brown" in the search field
    And I click the Find Owner button
    Then I should see the owner "Bob Brown" with address "789 Pine Rd.", city "Capital City", and telephone "5551112222" in the owners table

  Scenario: Search for newly added owner Islam Ibrahim and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Ibrahim" in the search field
    And I click the Find Owner button
    Then I should see the owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "5551234567" in the owners table

  Scenario: Update existing owner Bob Brown to Islam Ibrahim
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Brown" in the search field
    And I click the Find Owner button
    And I click the owner link "Bob Brown" with address "789 Pine Rd."
    And I click the Edit Owner button
    And I load updated owner data from "owner2.json"
    And I enter loaded updated owner details
    And I submit the Update Owner form
    Then I should see the updated owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "5551234567"

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

      Scenario Outline: Add a visit to a pet
        Given I open the home page
        When I click the Find Owners link
        And I enter last name "<lastName>" in the search field
        And I click the Find Owner button
        And I click the owner link "<firstName> <lastName>" with address "<address>"
        And I click the pet name link "<petName>"
        And I click the Add Visit button
        And I enter visit details:
          | date       | description      |
          | <date>     | <description>   |
        And I submit the Add Visit form


        Examples:
          | firstName | lastName | address      | petName | date       | description         |
          | Bob       | Brown    | 789 Pine Rd. | Max     | 2025-09-25 | Annual checkup      |

