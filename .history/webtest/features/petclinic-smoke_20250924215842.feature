Feature: Spring PetClinic Smoke Test
  As a user
  I want to verify all main navigation and icons work
  So that the application is healthy

  Scenario: Home page loads successfully
    Given I am on the home page
    Then I should see the PetClinic logo


  Scenario: Home navigation link is visible and clickable
    Given I am on the home page
    Then I should see and click the Home navigation link


  Scenario: Find Owners navigation link is visible and clickable
    Given I am on the home page
    Then I should see and click the Find Owners navigation link


  Scenario: Veterinarians navigation link is visible and clickable
    Given I am on the home page
    Then I should see and click the Veterinarians navigation link


  Scenario: Error navigation link is visible and clickable
    Given I am on the home page
    Then I should see and click the Error navigation link

  Scenario: All navigation links lead to correct pages
    Given I am on the home page
    When I click each navigation link
    Then Each page should load successfully

  Scenario: Main logo is visible and clickable
    Given I am on the home page
    Then I should see the PetClinic logo
    When I click the PetClinic logo
    Then I should be on the home page

  Scenario: All main page images and icons are visible
    Given I am on the home page
    Then I should see all main images and icons

  Scenario: Footer and additional links are visible and clickable
    Given I am on the home page
    Then I should see the footer
    And I should see all additional links
    When I click each additional link
    Then Each additional page should load successfully
