Feature: Owner Search Regression
  As a user
  I want to search for an owner and validate all their information
  So that the search and details functionality works correctly

  Scenario: Search for owner 'Rodriquez' and validate all information
    Given I am on the home page
    When I click the Find Owners icon
    And I wait a little
    And I enter "Rodriquez" in the last name field
    And I click the Find Owner button
    Then I should see the Owner Information header
    And I should see owner name "Eduardo Rodriquez"
    And I should see address "2693 Commerce St."
    And I should see city "McFarland"
    And I should see telephone "6085558763"
    And I should see pet "Jewel" with birth date "2010-03-07" and type "dog"
    And I should see pet "Rosy" with birth date "2011-04-17" and type "dog"
