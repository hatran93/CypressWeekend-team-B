describe("Manage my booking", () => {
    beforeEach(() => {
        cy.setCookie("__kwc_agreed", "true")
    })
    it("Get booking token and reservation URL", () => {
        const flyFrom = "LHR" // London
        const flyTo = "DXB" // Dubai
        const departAfter = "2022-11-15T00:00"
        const holdBaggage = "1"
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
            })
        })
    })
})
