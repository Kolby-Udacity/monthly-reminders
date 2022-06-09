// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { Interception, StaticResponse } from 'cypress/types/net-stubbing';
import { graphQlQueryToJson } from 'graphql-query-to-json';

import '@testing-library/cypress/add-commands';

type GraphQLVariables = {
  [key: string]: any;
};

Cypress.Commands.add(
  'gqlAssertBody',
  { prevSubject: true },
  (subject: Interception, graphQlString: string, variables?: GraphQLVariables) => {
    const bodyVariables = subject.request.body.variables ?? {};
    const expectedVariables = variables ?? {};
    const bodyQueryJson = graphQlQueryToJson(subject.request.body.query, {
      variables: bodyVariables,
    });
    const expectedQueryJson = graphQlQueryToJson(graphQlString, {
      variables: expectedVariables,
    });

    try {
      expect(expectedQueryJson).to.deep.equal(bodyQueryJson);
    } catch (error) {
      error.message = `expected ${JSON.stringify(expectedQueryJson)} to deeply equal ${JSON.stringify(bodyQueryJson)}`;

      throw Error(error);
    }
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      gqlAssertBody(graphQlString: string, variables?: GraphQLVariables): void;
    }
  }
}
