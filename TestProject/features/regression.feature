Feature: Application Regression Test

@regression
Scenario: Add a new owner
  Given I open the home page
  When I click the Find Owners link
  And I click the Add Owner button
  And I enter owner details from test scenario "addOwner"
  And I submit the Add Owner form
  Then I should see new owner created message
  And I should see the new owner added

@regression
Scenario: Search for newly added owner and validate in owners table
  Given I open the home page
  When I click the Find Owners link
  And I search for owner using test scenario "searchOwner"
  And I click the Find Owner button
  Then I should see the owner in the owners table from test scenario "searchOwner"

@regression
Scenario: Update existing owner
  Given I open the home page
  When I click the Find Owners link
  And I search and edit owner using test scenario "updateOwner"
  And I click the Find Owner button
  And I click the owner link from test scenario "updateOwner"
  And I click the Edit Owner button
  And I clear all owner fields
  And I update owner details from test scenario "updateOwner"
  And I submit the Update Owner form
  Then I should see owner updated message
  And I should see the updated owner details

@regression
Scenario: Add a new pet to updated owner
  Given I open the home page
  When I click the Find Owners link
  And I search and select owner using test scenario "addPet"
  And I click the Find Owner button
  And I click the owner link from test scenario "addPet"
  And I click the Add New Pet button
  And I enter pet details from test scenario "addPet"
  And I submit the Add Pet form
  Then I should see new pet added message

@regression
Scenario: Add a visit to updated owner's pet
  Given I open the home page
  When I click the Find Owners link
  And I search and select owner using test scenario "addVisit"
  And I click the Find Owner button
  And I click the owner link from test scenario "addVisit"
  And I click the Add Visit button
  And I enter visit details from test scenario "addVisit"
  And I submit the Add Visit form
  Then I should see visit booked message