// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands';
import '@cypress/code-coverage/support';
import '@cypress-audit/lighthouse/commands';
import 'cypress-axe';

import { terminalLog } from '../utils';

const compareSnapshotCommand = require('cypress-image-diff-js/dist/command');
compareSnapshotCommand();

// Used to set default terminal log without needing to specify it on every call
Cypress.Commands.add('checkAccessibility', (...args: any[]) => {
  let mockedTime = null;

  // cypress-axe fails when clock is mocked. So restore it to normal and then mock it again.
  cy.clock().then((clock) => {
    // @ts-ignore
    mockedTime = clock.details();

    clock.restore();
  });

  if (!args[1]) {
    args[1] = {
      rules: {
        'html-has-lang': { enabled: false },
        'page-has-heading-one': { enabled: false },
        'color-contrast': { enabled: false },
      },
    };
  }

  if (!args[2]) {
    args[2] = terminalLog;
  }

  cy.checkA11y(...args);
  cy.clock(mockedTime);
});

declare global {
  namespace Cypress {
    interface Chainable {
      checkAccessibility: (...args: any[]) => void;
    }
  }
}
// Alternatively you can use CommonJS syntax:
// require('./commands')
