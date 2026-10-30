const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationintesting.online',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 900,
    // La app es una demo pública y a veces responde lento
    defaultCommandTimeout: 10000,
    // Reintenta una vez en modo headless (CI) para absorber fallas de red
    retries: { runMode: 1, openMode: 0 },
    video: false,
  },
});
