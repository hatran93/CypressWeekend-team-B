describe("Intro test", () => {
    it("Check everything works", () => {
        cy.visit("/cheap-flights")
        cy.log("YAAY! IT WORKS!")
    })
})