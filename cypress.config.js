const { defineConfig } = require("cypress")

module.exports = defineConfig({
    chromeWebSecurity: false,
    env: { hideXHRInCommandLog: true },
    e2e: {
    }
})