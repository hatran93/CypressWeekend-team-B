describe("Search task 01", () => {
    beforeEach(() => {
        cy.setCookie("__kwc_agreed", "true")
    })

    it("Check everything works", () => {
        let originCity, destinationCity;
        cy.visit("/cheap-flights")
        cy.get('[data-test="PictureCard"]')
            .should("have.length", 30)
            .and("be.visible")
            .first().within(()=>{
                cy.get('h3').first().invoke('text').then($el =>{
                    originCity = $el.replace(',', '').replace(' ', '-').toLowerCase();
                    // originCity = $el;

                    cy.log(originCity)
                })
                
                cy.get('h3').eq(1).invoke('text').then($el =>{
                    destinationCity = $el;
                    cy.log(destinationCity)
                })

            })
            cy.get('[data-test="PictureCard"]').first().click()
            
            .then(()=>{
                cy.log(destinationCity)
            })
        // cy.log(originCity)
            // .click()
    })
})
