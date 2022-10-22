describe("Task 2", () => {
  it("Manage My Booking task", () => {
      cy.setCookie('__kwc_agreed', 'false')
      cy.visit("/manage/293836664/9a4a0f1c-c694-4e71-9b0c-0401ab39739a")
      cy.get('[data-test="FlightsChange"]').click()

      cy.contains('p', 'Pay only the price difference').should('include.text', 'Pay only the price difference')
      cy.contains('p', 'Pay only the price difference').should('be.visible')
      //cy.get('*[class^="Alert__StyledContent"]').should('include.text', 'Pay only the price difference')

      cy.get('[data-test="search-origin"]').first().type('Vienna')
      cy.get('.selected').first().click()
      cy.get('[data-test="search-destination"]').eq(1).type('Barcelona')
      cy.get('.selected').first().click()

      cy.get('[data-test="ChangeAlternativesSearchForm-button"]').should('be.visible').click()
      cy.get('[data-test="BookingJourneyChange-alternative-list"]').find('[data-test="Journey-toggle"]', { timeout: 11000 }).first().click()

      cy.contains('p', 'FREE').should('include.text', 'FREE')
      cy.contains('p', 'FREE').should('be.visible')

      cy.get('[data-test="ItineraryGuarantee"]').eq(0).should('include.text','Kiwi.com Guarantee')
      cy.get('[data-test="ItineraryGuarantee"]').eq(0).should('be.visible','Kiwi.com Guarantee')
      cy.get('[data-test="JourneyBookingButton-Itinerary-bookingBtn"]').click()

      cy.get('[data-test="changeConfirmation-LegalCheckbox"]').check()






      Cypress.on("uncaught:exception", (err, runnable) => {
        return false
      })
  })
})