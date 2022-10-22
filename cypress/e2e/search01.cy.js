describe("Search task 01", () => {
    beforeEach(() => {
        cy.setCookie("__kwc_agreed", "true")
    })

    it("Search one-way cheap flights", () => {
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
})
