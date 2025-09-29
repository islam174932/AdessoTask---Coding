Feature: Pet Clinic Regression Tests
  Background:
    Given I open the home page

 

  @regression  
  Scenario: Search for newly created owner and validate in owners table
    When I click the Find Owners link
    And I enter last name "Ibrahim" in the search field
    And I click the Find Owner button
    Then I should see the owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "5551234567" in the owners table
    Then the browser will be closed
      Then the browser will be closed

  @regression
  Scenario: Update existing owner (Islam becomes Layla)
    When I click the Find Owners link
    And I enter last name "Ibrahim" in the search field
    And I click the Find Owner button
    And I click the owner link from JSON with address from JSON
    And I click the Edit Owner button
    And I update owner details from JSON
    And I submit the Update Owner form
    Then I should see the updated owner from JSON
    And I should see the confirmation message "Owner Values Updated"
    Then the browser will be closed
      Then the browser will be closed

  @regression
  Scenario: Search for updated owner (now Layla Hassan)
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    Then I should see the updated owner from JSON
    Then the browser will be closed
      Then the browser will be closed

  @regression
  Scenario: Add a new pet to updated owner (Layla)
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    Then the browser will be closed
    And I click the owner link from JSON with address from JSON
    And I click the Add New Pet button
    And I enter pet details from JSON
    And I submit the Add Pet form
    Then I should see the new pet from JSON
      Then the browser will be closed

  @regression
  Scenario: Add a visit to the pet
    When I click the Find Owners link
    And I enter last name from JSON in the search field
    And I click the Find Owner button
    And I click the owner link from JSON with address from JSON
    And I click the pet name link from JSON
    And I click the Add Visit button
    And I enter visit details from JSON
    And I submit the Add Visit form
    Then the browser will be closed

 @regression
  Scenario: Create new owner (Islam Ibrahim)
    When I create a new owner from initial JSON data
    Then I should see the owner "Islam Ibrahim" with address "000 Pine Rd.", city "Cairo", and telephone "5551234567" in the owners table
    Then the browser will be closed
    Then the browser will be closed