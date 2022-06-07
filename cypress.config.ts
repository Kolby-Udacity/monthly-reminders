import { defineConfig } from 'cypress';

const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse');

/* eslint import/no-default-export: "off" */
export default defineConfig({
  watchForFileChanges: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.{js,jsx,ts,tsx}',
    viewportWidth: 1366,
    viewportHeight: 720,
    chromeWebSecurity: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config): Cypress.PluginConfigOptions {
      require('@cypress/code-coverage/task')(on, config);
      require('cypress-image-diff-js/dist/plugin')(on, config);

      on('before:browser:launch', (browser, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on('task', {
        lighthouse: lighthouse(),
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });

      return config;
    },
  },
  component: {
    specPattern: 'src/**/*.spec.{js,jsx,ts,tsx}',
    viewportWidth: 1366,
    viewportHeight: 720,
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  // @ts-ignore
  lighthouse: {
    thresholds: {
      performance: 90,
      accessibility: 80,
      'best-practices': 85,
      seo: 85,
      pwa: 20,
    },
    options: {
      formFactor: 'desktop',
      screenEmulation: {
        width: 1440,
        height: 940,
        deviceScaleRatio: 1,
        mobile: false,
        disable: false,
      },
    },
  },
});
