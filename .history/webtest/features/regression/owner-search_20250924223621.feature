Feature: Owner Search Regression
  As a user
  I want to search for an owner and validate all their information
  So that the search and details functionality works correctly

  Scenario Outline: Search for owner '<lastName>' and validate all information
    Given I am on the home page
    When I click the Find Owners icon
    And I wait a little
    And I enter "<lastName>" in the last name field
    And I click the Find Owner button
    Then I should see the Owner Information header
    And I should see owner name "<ownerName>"
    And I should see address "<address>"
    And I should see city "<city>"
    And I should see telephone "<telephone>"
    And I should see pet "<pet1>" with birth date "<birth1>" and type "<type1>"
    And I should see pet "<pet2>" with birth date "<birth2>" and type "<type2>"

    Examples:
      | lastName  | ownerName          | address             | city      | telephone  | pet1  | birth1     | type1 | pet2 | birth2     | type2 |
      | Rodriquez | Eduardo Rodriquez  | 2693 Commerce St.   | McFarland | 6085558763 | Jewel | 2010-03-07 | dog   | Rosy | 2011-04-17 | dog   |

  Scenario Outline: Add a new owner '<firstName> <lastName>'
    Given I am on the home page
    When I click the Find Owners icon
    And I click the Add Owner button
    And I enter "<firstName>" in the first name field
    And I enter "<lastName>" in the last name field
    And I enter "<address>" in the address field
    And I enter "<city>" in the city field
    And I enter "<telephone>" in the telephone field
    And I click the Submit Owner button
    Then I should see owner name "<firstName> <lastName>"
    And I should see address "<address>"
    And I should see city "<city>"
    And I should see telephone "<telephone>"

    Examples:
      | firstName | lastName | address           | city      | telephone  |
      | John      | Doe      | 123 Main Street   | Springfield | 5551234567 |
