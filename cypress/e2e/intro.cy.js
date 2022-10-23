describe("Task 1", () => {
    it("Search One-way cheapflights ticket + one bag,", () => {
        cy.setCookie('__kwc_agreed', 'true')
        cy.visit("/cheap-flights")
        cy.log("YAAY! IT WORKS!")

        cy.get('[data-test="PictureCard"]')
                .should('be.visible');
                cy.log('kontrola Picture Cards');

        cy.get('[data-test="PictureCard"]')
                .first()
                .click();

        cy.get('[data-test="SearchFormModesPicker-active-return"]')
                .click();

        cy.get('[data-test="ModePopupOption-oneWay"]')
                .click();

        cy.get('[data-test="PassengersField"]')
                .click();

        cy.get('[data-test="BagsPopup-cabin"]')
                .children()
                .eq(1)
                    .children()
                    .eq(0)
                        .children()
                        .eq(2)
                        .click();

        cy.get('[data-test="PassengersFieldFooter-done"]')
                .should('be.visible')
                .click()
                cy.log('kontrola Done/Batožina')    

        cy.get('[data-test="LandingSearchButton"]')
                .click();

        cy.get('[data-test="BagsPopup-cabin"] input')
                .should('have.value',"1")
                .should('be.visible')
                cy.log('kontrola množstva batožiny')

        cy.get('[data-test="SearchFormModesPicker-active-oneWay"]')
                .should('include.text',"One-way")
                cy.log('kontrola One-way')

        cy.get('[data-test="PlacePickerInput-origin"]')
                .should('exist')
                .should('be.visible');
                cy.log('kontrola miesta odletu')

        cy.get('[data-test="PlacePickerInput-destination"]')
                .should('exist')
                .should('be.visible');
                cy.log('kontrola miesta príletu')

        Cypress.on("uncaught:exception", (err, runnable) => {
                    return false
                  })        
        
    })



    it.only("Search Prague to Vienna, make an itinerary and share", () => {
        cy.setCookie('__kwc_agreed', 'true')
        cy.visit("/search/results/prague-czechia/vienna-austria/anytime/anytime?sortBy=price")
        

        cy.get('[data-test="FilterHeader-transport"]')
                .click();          
        cy.get('[data-test="TransportOptionCheckbox-bus"]')
                .click({force: true});
        cy.get('[data-test="TransportOptionCheckbox-aircraft"]')
                .click({force: true});
        cy.get('[data-test="TransportOptionCheckbox-bus"]')
                .should('be.checked');


        cy.get('[data-test="SearchFieldDateInput"]')
                .first()
                .click();
        cy.get('[data-test="Container"]')
                .eq(1)
                .click();
        cy.get('[data-test="CalendarContainer"]')
                .eq(1)
                .click();
        
        cy.get('[data-test="SearchFormDoneButton"]').click({force: true})
                /*.should('exist')
                .scrollIntoView()
                .invoke('show')

                cy.contains('Set dates').click()*/
                //cy.get('[data-test="SearchFormDoneButton"]').find('*[class^="ButtonPrimitiveContent__StyledButtonPrimitiveContent"]').first().click()
                //cy.get('div*[class^="ButtonPrimitiveContent__StyledButtonPrimitiveContent"]').contains('Set dates').click()

        cy.get('[data-test="ResultCardBadges"]')
                .first()
                .should('exist')
                .should('be.visible')
                .click();
        
        cy.get('[data-test="PopupShareButton"]').find('*[class^="ButtonPrimitiveContent__StyledButtonPrimitiveContent"]').first().click({force: true})
        cy.get('[data-test="ShareSheetModalSection"]').find('*[class^="ButtonPrimitiveContent__StyledButtonPrimitiveContent"]').first().dblclick({force: true})
        cy.get('*[class^="ToastMessage__StyledInnerWrapper"]').should('include.text', 'Link copied', { timeout: 6000 })        

        Cypress.on("uncaught:exception", (err, runnable) => {
            return false
          }) 
    }) 
}) 
