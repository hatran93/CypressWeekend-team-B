describe("Search task test", () => {
    beforeEach("setup", () => {
        cy.AllowCookies()
        cy.CheapFlightsRootPage("/")
    })

    it("Search one-way flight", () => {
        cy.get('[data-test="PictureCard"]')
            .should("have.length", 30)
            .and("be.visible")
        cy.get('[data-test="PictureCard"]')
            .first()
            .click()
            .then(() => {
                cy.url().should(
                    "include",
                    "/cheap-flights/london-united-kingdom"
                )
            })

        //change flight mode
        cy.get('[data-test="SearchFormModesPicker-active-return"]')
            .click()
            .then(() => {
                cy.get('[data-test="ModePopupOption-oneWay"]')
                    .should("be.visible")
                    .click()
            })

        cy.get('[data-test="PassengersField"]').should("be.visible").click()
        //add one bag
        cy.get('[data-test="BagsPopup-cabin"]')
            .should("be.visible")
            .find("button")
            .eq(1)
            .click()
        cy.get('[data-test="PassengersField"]').should("contain", 1)

        cy.get('[data-test="PassengersFieldFooter-done"]').click()
        //confirm search
        cy.get('[data-test="LandingSearchButton"]')
            .should("have.text", "Search")
            .click()
            .then(() => {
                cy.url().should("include", "/results")
            })

        //check if all results are displayed correct
        cy.get('[data-test="ResultList"]').should("be.visible")

        cy.get('[data-test="SearchFieldItem-origin"]').should(
            "contain",
            "London"
        )
        cy.get('[data-test="SearchFieldItem-destination"]').should(
            "contain",
            "Lisbon"
        )
        cy.get('[data-test="BagsPopup-cabin"] input').should("have.value", 1)
        cy.get('[data-test="SearchFormModesPicker-active-oneWay"]').should(
            "contain",
            "One-way"
        )
    })
})
