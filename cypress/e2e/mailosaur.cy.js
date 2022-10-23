describe("Mailosaur task", () => {
    it("Mailosaur", () => {
        const serverId = "hpj3nevp"
        const testEmail = `something@${serverId}.mailosaur.net`
        const downloadedFile = "cypress/e2e/downloads/mailosaurusTest.html"
        Cypress.config("baseUrl", null)

        cy.request(
            "POST",
            `https://qaa-be.platform-prod.skypicker.com/booking/simple?confirm=true&reservation_email=${testEmail}`
        ).then((xhr) => {
            // cy.mailosaurGetMessagesBySubject(serverId, 'confirmed'
            cy.mailosaurGetMessage(
                serverId,
                {
                    sentTo: testEmail
                },
                {
                    subject: "confirmed"
                }
            ).then((message) => {
                cy.log("Message subject:", message.subject)
                cy.writeFile(downloadedFile, message.html.body)
                const bookingId = xhr.body
                    .split("<h2>")[1]
                    .split("<br>")[0]
                    .trim()
                cy.visit(`./${downloadedFile}`)
                cy.contains("p", "Booking number")
                    .next("p")
                    .invoke("text")
                    .then(($el) => {
                        expect($el.trim().replace(/ /g, "")).to.eq(bookingId)
                    })
                cy.get(".t-header__bottom").within(() => {
                    cy.contains("Saver Ticket")
                    cy.contains("Basic Services")
                })
                cy.contains("p", "Booking status")
                    .parent()
                    .contains("span", "Confirmed")
                    .should("be.visible")

                cy.get("th.t-bnr-mobile__foot")
                    .scrollIntoView()
                    .within(() => {
                        cy.get('img[alt="App Store"]')
                            .should("be.visible")
                            .parent()
                            .invoke("attr", "href")
                            .then((link) => {
                                cy.request(link).its("status").should("eq", 200)
                            })
                        cy.get('img[alt="Google Play"]')
                            .should("be.visible")
                            .parent()
                            .invoke("attr", "href")
                            .then((link) => {
                                cy.request(link).its("status").should("eq", 200)
                            })
                    })
                cy.contains("a", "Manage trip")
                    .scrollIntoView()
                    .should("be.visible")
                    .click()
                cy.url().should("contain", "https://www.kiwi.com/en/manage/")
                cy.url().should("contain", "t-email_confirmed_not_fully_booked")
            })
        })
    })
})
