const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
    baseUrl: "https://www.saucedemo.com/",
    viewportWidth: 1440,
    viewportHeight: 900
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true,
    charts: true,
    reportPageTitle: 'E2E Tests Report',
    embeddedScreenshots: true,
    inlineAssets: true
  }
});
