describe("Search task", () => {
    beforeEach(() => {
        cy.setCookie("__kwc_agreed", "true")
    })

    it("Search one-way cheap flights", () => {
        cy.intercept('POST', 'https://tag-manager.kiwi.com/g/collect?*').as('tagManager')
        let originCity, destinationCity
        cy.visit("/cheap-flights")
        cy.get('[data-test="PictureCard"]')
            .should("have.length", 30)
            .and("be.visible")
            .first()
            .within(() => {
                cy.get("h3")
                    .first()
                    .invoke("text")
                    .then(($el) => {
                        originCity = $el
                            .replace(",", "")
                            .replace(/ /g, "-")
                            .toLowerCase()
                        cy.log(originCity)
                    })

                cy.get("h3")
                    .eq(1)
                    .invoke("text")
                    .then(($el) => {
                        destinationCity = $el
                            .replace(",", "")
                            .replace(/ /g, "-")
                            .toLowerCase()
                        cy.log(destinationCity)
                    })
            })
        cy.get('[data-test="PictureCard"]')
            .first()
            .should("be.visible")
            .click()
            .then(() => {
                cy.wait('@tagManager').its('response.statusCode').should('eq', 200)
                cy.url().should(
                    "contain",
                    `/cheap-flights/${originCity}/${destinationCity}`
                )
            })
        
        // change to one-way and add 1 hand luggage
        cy.get('[data-test="SearchFormModesPicker-active-return"]')
            .should("be.visible")
            .click()
        cy.get('[data-test="ModesPopup"]')
            .should("be.visible")
            .within(() => {
                cy.contains("p", "One-way").should("be.visible").click()
            })
        cy.get('[data-test="SearchFormModesPicker-active-oneWay"]').should(
            "be.visible"
        )
        cy.get('[data-test="PassengersField"]').should("be.visible").click()
        cy.get('[data-test="PassengersPopover"]').within(() => {
            cy.get('[data-test="BagsPopup-cabin"]')
                .find('button[aria-label="increment"]')
                .should("be.visible")
                .click()
            cy.get('[data-test="PassengersFieldFooter-done"]')
                .should("be.visible")
                .click()
        })

        // click on Search button and check all information are correct
        cy.get('a[data-test*="SearchButton"]')
            .should("be.visible")
            .click()
            .then(() => {
                cy.url().should(
                    "contain",
                    `/search/results/${originCity}/${destinationCity}/anytime/no-return?bags=1.0`
                )
            })
        cy.get('[data-test="ResultList"]').should("be.visible")
    })

    it("Search Bus only with return date and share link", () => {
        cy.intercept(
            "POST",
            "https://api.skypicker.com/umbrella/v2/graphql?featureName=SearchReturnItinerariesQuery"
        ).as("searchRequest")
        cy.visit(
            "/search/results/prague-czechia/vienna-austria/anytime/anytime?sortBy=price"
        )
        cy.wait("@searchRequest").its("response.statusCode").should("eq", 200)
        cy.get('[data-test="TransportOptionChoiceGroup"]')
            .scrollIntoView()
            .should("be.visible")
            .within(() => {
                cy.get('[data-test^="TransportOptionCheckbox"]').should(
                    "have.length",
                    3
                )
                //  choose BUS only and check it was correctly set
                cy.get('[data-test="TransportOptionCheckbox-bus"]')
                    .parents('div[class^="FilterWrapper"]')
                    .within(() => {
                        cy.get("button").click({ force: true })
                    })
                cy.wait("@searchRequest").then((xhr) => {
                    expect(xhr.response.statusCode).to.eq(200)
                    expect(
                        xhr.request.body.variables.filter.transportTypes.toString()
                    ).to.eq("BUS")
                })
                cy.url().should("contain", "transport=bus")
                cy.get("input[checked]").should("have.length", 1)
                cy.get('[data-test="TransportOptionCheckbox-bus"]').should(
                    "be.checked"
                )
            })
        // select return date = 1st day of the next month
        cy.contains('[data-test="SearchDateInput"]', "Return")
            .should("be.visible")
            .click()
        cy.get('[data-test="CalendarMoveNextButton"]')
            .should("be.visible")
            .click()
        cy.get('[data-type="DayContainer"]')
            .first()
            .should("be.visible")
            .click()
            .invoke("attr", "data-value")
            .then((returnDate) => {
                cy.get('[data-test="SearchFormDoneButton"]')
                    .should("be.visible")
                    .click()
                cy.wait("@searchRequest")
                    .its("response.statusCode")
                    .should("eq", 200)
                cy.url().should("contain", returnDate)
            })

        // share first result
        cy.get('[data-test="ResultCardWrapper"]')
            .should("be.visible")
            .first()
            .within(() => {
                cy.get('[data-test="PopupShareButton"] button').click({
                    force: true
                })
            })
        // check all share options are visible
        cy.get('div[role="dialog"]').within(() => {
            cy.contains("h2", "Share this itinerary").should("be.visible")
            cy.get('[data-test="ShareSheetModalSection"]').within(() => {
                cy.get("button").should("be.visible").and("have.length", 6)
                cy.get('[aria-label="whatsapp"]').should("be.visible")
                cy.get('[aria-label="facebookmessenger"]').should("be.visible")
                cy.get('a[href^="sms:&body=Check out this route:"]').should(
                    "be.visible"
                )
                cy.get('[aria-label="telegram"]').should("be.visible")
                cy.get('[aria-label="viber"]').should("be.visible")
                cy.get('[aria-label="email"]').should("be.visible")
                cy.get('[data-test="ShareSheetModalInputField"]').should(
                    "contain.value",
                    "https://kiwi.com/u/"
                )
                cy.contains("button", "Copy").should("be.visible").click()
            })
        })
        cy.contains('div[class^="ToastMessage"]', "Link copied").should(
            "be.visible"
        )
    })
})
