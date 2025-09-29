Feature: Application Smoke Test


@smoke
Scenario: Home navigation works and Welcome is shown
  Given I open the home page
  When I click the Home icon
  Then I should see the Welcome header
  

@smoke
Scenario: Find Owners search returns correct results
  Given I open the home page
  When I click the Find Owners link
  And I enter "Davis" in the last name field
  And I click the Find Owner button
  Then I should see the Owners table with correct Davis entries
 

@smoke
Scenario: Veterinarians table and pagination
  Given I open the home page
  When I click the Veterinarians link
  Then I should see the Veterinarians table with correct data
 

@smoke
Scenario: Error page displays correctly
  Given I open the home page
  When I click the Error link
  Then I should see the Something happened header
 
