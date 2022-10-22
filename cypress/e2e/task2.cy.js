describe("Search task test", () => {
    beforeEach("setup", () => {
        cy.AllowCookies()
    })
    it("change booking in MMB", () => {
        const newOriginCity = "Vienna"
        const newDestinationCity = "Barcelona"

        cy.visit("/manage/293836664/9a4a0f1c-c694-4e71-9b0c-0401ab39739a")

        cy.get('[data-test="FlightsChange"]')
            .scrollIntoView()
            .should("be.visible")
            .click()
        // 3.
        cy.contains("p", "Pay only the price difference").should("be.visible")
        //4.
        cy.get('[data-test="search-origin"]').first().type(newOriginCity)
        cy.get(".ModalSimplePicker")
            .eq(0)
            .should("contain", newOriginCity)
            .click()

        cy.get('[data-test="search-destination"]')
            .first()
            .type(newDestinationCity)
        cy.get(".ModalSimplePicker")
            .eq(0)
            .should("contain", newDestinationCity)
            .click()

        cy.get('[data-test="ChangeAlternativesSearchForm-button"]')
            .should("be.visible")
            .click()
        //5.

        cy.get('[data-test="BookingJourneyChange-alternative-list"]')
            .find('[data-test="Journey-toggle"]')
            .eq(0)
            .contains('[data-test="journeyInfo-price-tooltip"]', "FREE")
            .click()

        //6.
        cy.get('[data-test="ItineraryGuarantee"]')
            .scrollIntoView()
            .should("be.visible")
        //7.
        cy.get(
            '[data-test="JourneyBookingButton-Itinerary-bookingBtn"]'
        ).click()
        //8.
        cy.get('[data-test="changeConfirmation-NewItinerary"]')
    })
})
