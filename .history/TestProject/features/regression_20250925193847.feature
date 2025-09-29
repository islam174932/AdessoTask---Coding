
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

  Scenario: Add a new pet to owner Bob Brown
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Brown" in the search field
    And I click the Find Owner button
    And I click the owner link "Bob Brown" with address "789 Pine Rd."
    And I click the Add New Pet button
    And I load pet data from "pet1.json"
    And I enter loaded pet details
    And I submit the Add Pet form
    Then I should see the new pet "Max" with birth date "2023-01-01" and type "dog" for owner "Bob Brown"

  Scenario: Add a visit to pet Max of owner Bob Brown
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Brown" in the search field
    And I click the Find Owner button
    And I click the owner link "Bob Brown" with address "789 Pine Rd."
    And I click the pet name link "Max"
    And I click the Add Visit button
    And I load visit data from "visit1.json"
    And I enter loaded visit details
    And I submit the Add Visit form

