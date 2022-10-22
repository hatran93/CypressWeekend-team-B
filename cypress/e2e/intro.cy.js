describe("Task 1", () => {
    it("Sheaarch One-way cheapflights ticket + one bag,", () => {
        cy.setCookie('__kwc_agreed', 'true')
        cy.visit("/cheap-flights")
        cy.log("YAAY! IT WORKS!")

        cy.get('[data-test="PictureCard"]')
            .should('be.visible');

        cy.get('[data-test="PictureCard"]').first().click();
        cy.get('[data-test="SearchFormModesPicker-active-return"]').click();
        cy.get('[data-test="ModePopupOption-oneWay"]').click();
        cy.get('[data-test="PassengersField"]').click();

        cy.get('[data-test="BagsPopup-cabin"]').children().eq(1).children().eq(0).children().eq(2).click();
            cy.get('[data-test="PassengersFieldFooter-done"]')
                .should('be.visible')
                .click()

        cy.get('[data-test="LandingSearchButton"]').click();
            cy.get('[data-test="BagsPopup-cabin"] input')
                .should('have.value',"1", 'be.visible');

        cy.get('[data-test="SearchFormModesPicker-active-oneWay"]')
                .should('include.text',"One-way")
        
        cy.get('[data-test="PlacePickerInput-origin"]')
                .should('exist');
        cy.get('[data-test="PlacePickerInput-origin"]')
                .should('be.visible');

        cy.get('[data-test="PlacePickerInput-destination"]')
                .should('exist');
        cy.get('[data-test="PlacePickerInput-destination"]')
                .should('be.visible');

        Cypress.on("uncaught:exception", (err, runnable) => {
                    return false
                  })        
        
    })
})