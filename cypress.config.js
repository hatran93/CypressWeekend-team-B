const { defineConfig } = require("cypress")

module.exports = defineConfig({
    chromeWebSecurity: false,
    env: { hideXHRInCommandLog: true,
        MAILOSAUR_API_KEY: "RlHm7yWNv3D4Fsg4"
     },
    e2e: {
        baseUrl: "https://www.kiwi.com/en",
        defaultCommandTimeout: 10000,
        responseTimeout: 60000,
        

    }
})
