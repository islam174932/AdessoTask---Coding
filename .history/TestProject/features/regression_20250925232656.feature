Feature: Application Regression Test

@regression
Scenario: Add a new owner
    Given I open the home page
    When I click the Find Owners link
    And I click the Add Owner button
    And I enter owner details from JSON
    And I submit the Add Owner form
    Then I should see the new owner added
    And I should see the confirmation message "New Owner Created"

@regression
Scenario: Search for newly added owner and validate in owners table
    Given I open the home page
    When I click the Find Owners link
    And I enter last name "Ibrahim" in the search field
    And I click the Find Owner button
    Then I should see the owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "5551234567" in the owners table

@regression
Scenario: Update existing owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    And I click the owner link from JSON with address from JSON
    And I click the Edit Owner button
    And I update owner details from JSON
    And I submit the Update Owner form
    Then I should see the updated owner from JSON
    And I should see the confirmation message "Owner Values Updated"

@regression
Scenario: Add a new pet to an owner
    Given I open the home page
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    And I click the owner link from JSON with address from JSON
    And I click the Add New Pet button
    And I enter pet details from JSON
    And I submit the Add Pet form
    Then I should see the new pet from JSON

@regression
Scenario: Add a visit to a pet
    Given I open the home page
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    And I click the owner link from JSON with address from JSON
    And I click the pet name link from JSON
    And I click the Add Visit button
    And I enter visit details from JSON
    And I submit the Add Visit form

