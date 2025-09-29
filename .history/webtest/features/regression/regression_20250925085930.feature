Feature: PetClinic Owner Regression Tests
  As a user
  I want to test owner search and add flows
  So that I can verify owner management works

  Scenario Outline: Search for owner '<lastName>' and validate all information
    Given I am on the home page
    When I click the Find Owners icon
    And I wait a little
    And I enter "<lastName>" in the last name field
    And I click the Find Owner button
    And I click the first owner link in the results table
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

  Scenario Outline: Add and search for new owner '<firstName> <lastName>'
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
    And I wait a bit longer
    When I click the Find Owners icon
    And I wait a bit longer
    And I enter "<lastName>" in the last name field
    And I click the Find Owner button
    And I click the first owner link in the results table
    Then I should see the Owner Information header
    And I should see owner name "<firstName> <lastName>"
    And I should see address "<address>"
    And I should see city "<city>"
    And I should see telephone "<telephone>"

    Examples:
      | firstName | lastName | address           | city        | telephone  |

  Scenario: Update existing owner information
    Given I am on the home page
    When I click the Find Owners icon
    And I enter "Doe" in the last name field
    And I click the Find Owner button
    And I click the first owner link in the results table
    And I click the Edit Owner button
    And I enter "Islam" in the first name field
    And I enter "Egypt" in the address field
    And I click the Update Owner button
    Then I should see owner name "Islam Doe"
    And I should see address "Egypt"
