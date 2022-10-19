const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env:{hideXHRInCommandLog: true},
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
})