describe("Manage my booking", () => {
    beforeEach(() => {
        cy.setCookie("__kwc_agreed", "true")
    })
    it("Get booking token and reservation URL", () => {
        const flyFrom = "LHR" // London
        const flyTo = "DXB" // Dubai
        const departAfter = "2022-11-15T00:00"
        const holdBaggage = "1"
        const newOriginCity = "Vienna"
        const newDestinationCity = "Barcelona"
        cy.request(
            "GET",
            `https://api.skypicker.com/flights?partner=cypress&fly_from=${flyFrom}&fly_to=${flyTo}&depart_after=${departAfter}&max_stopovers=0&adult_hold_bag=${holdBaggage}`
        ).then((xhr) => {
            const bookingToken = xhr.body.data[0].booking_token
            cy.request(
                "POST",
                "https://qaa-be.platform-prod.skypicker.com/booking/create_booking?confirm=api_call",
                {
                    booking_ancillaries: {
                        fare_type: "flexi",
                        guarantee: true,
                        service_package: "premium"
                    },
                    booking_passengers: [
                        {
                            birthday: "1988-04-21",
                            category: "adult",
                            document_expiry: "2025-12-31",
                            document_number: "12345678XY",
                            email: "test@kiwi.com",
                            name: "TEST",
                            nationality: "gb",
                            passenger_ancillaries: {
                                axa_insurance: "basic",
                                hand_baggage: true,
                                hold_baggage: true,
                                priority_boarding: false
                            },
                            phone: "+44 55555555",
                            surname: "TEST",
                            title: "mr"
                        }
                    ],
                    booking_token: bookingToken
                }
            ).then((xhr) => {
                const reservationURL = xhr.body.mmb_link
                cy.visit(reservationURL)
                cy.get('[data-test="FlightsChange"]', { timeout: 20000 })
                    .scrollIntoView()
                    .should("be.visible")
                    .click()
                cy.contains("p", "Pay only the price difference").should(
                    "be.visible"
                )

                // change origin city and destination city
                cy.get('[data-test="search-origin"]')
                    .first()
                    .type(newOriginCity)
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
                cy.intercept(
                    "GET",
                    "https://booking-api.skypicker.com/mmb/v1/bookings/*/itinerary_changes/*"
                ).as("modifyBooking")

                // search for routes
                cy.get('[data-test="ChangeAlternativesSearchForm-button"]')
                    .should("be.visible")
                    .click()
                cy.wait("@modifyBooking")
                    .its("response.statusCode")
                    .should("eq", 200)

                cy.get('[data-test="BookingJourneyChange-alternative-list"]')
                    .find('[data-test="Journey-toggle"]')
                    .eq(0)
                    .contains('[data-test="journeyInfo-price-tooltip"]', "FREE")
                    .click()
                cy.get("div._expanded")
                    .should("be.visible")
                    .within(() => {
                        cy.wait(500)
                        cy.get('[data-test="ItineraryGuarantee"]')
                            .scrollIntoView()
                            .should("be.visible")
                        cy.get(
                            '[data-test="JourneyBookingButton-Itinerary-bookingBtn"]'
                        )
                            .scrollIntoView()
                            .click()
                    })

                // agree with legal terms and confirm booking change
                cy.get('[data-test="ChangeConfirmation-CheckoutBtn"]')
                    .scrollIntoView()
                    .should("be.visible")
                    .and("be.disabled")

                cy.get('[data-test="changeConfirmation-NewItinerary"]').within(
                    () => {
                        cy.contains(newDestinationCity).should("be.visible")
                        cy.contains(newOriginCity).should("be.visible")
                    }
                )
                cy.get('[data-test="changeConfirmation-LegalCheckbox"]')
                    .scrollIntoView()
                    .click({ force: true })
                cy.get('[data-test="ChangeConfirmation-CheckoutBtn"]').click()

                cy.get('[data-test="BookingJourneyChange"]').within(() => {
                    cy.contains("h2", "Thanks for your request").should(
                        "be.visible"
                    )
                    cy.contains(
                        "We'll change your trip and email you as soon as it's done."
                    ).should("be.visible")
                    cy.contains("button", "Return to your trip")
                        .should("be.visible")
                        .click()
                })
                cy.get('[data-test="BookingStatusBadge-changeInProgress"]')
                    .should("be.visible")
                    .click()
                cy.contains(
                    'div[role="tooltip"]',
                    "We're processing your requested itinerary change and we'll let you know as soon as it's done."
                ).should("be.visible")

                // wait for booking to process and reload page
                // otherwise booking not processed and test fails
                // status not possible to check-in with kiwi
                cy.wait(5000)
                cy.reload()


                cy.get('[data-test^="BoardingPasses-section-"]').each(() => {
                    cy.get(
                        '[data-test^="BoardingPassHeaderBadge-ground_processing"]'
                    ).should("be.visible")
                })

                // check Trip summary
                cy.get('[data-test="processing"]').should("be.visible").click()
                cy.contains(
                    'div[role="tooltip"]',
                    "We're processing your requested itinerary change and we'll let you know as soon as it's done."
                ).should("be.visible")
                cy.get('[data-test="Journey-toggle"]').click()
                cy.get('[data-test="ItineraryGuarantee"]')
                    .should("be.visible")
                    .should("contain.text", "Kiwi.com Guarantee")
                cy.contains(
                    'div[class^="Alert"]',
                    "We’re changing your trip. We'll email you when it's done."
                ).should("be.visible")

                // check baggage section
                cy.get('[data-test="BookingBagsCard"]')
                    .find('[data-test="BookingBagsOverview"]')
                    .should("have.length", 2)
                    .each(($el) => {
                        cy.wrap($el)
                            .scrollIntoView()
                            .contains("p", "baggage")
                            .should("be.visible")
                            .and("contain.text", "1×")
                        cy.wrap($el)
                            .contains("Processing")
                            .should("be.visible")
                            .click({ force: true })
                        cy.contains(
                            'div[role="tooltip"]',
                            "You've paid for this service. We'll let you know as soon as it has been processed."
                        ).should("be.visible")
                    })
            })
        })
    })
})
