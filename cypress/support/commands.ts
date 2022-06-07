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
import type { RecurseDefaults } from 'cypress-recurse';
import { graphQlQueryToJson } from 'graphql-query-to-json';

import '@testing-library/cypress/add-commands';

import { aliasOperation } from '../utils';

type Method = 'POST' | 'GET';
type GraphQLVariables = {
  [key: string]: any;
};
type InitializeOptions = {
  url: string | null | undefined;
  method: Method | null | undefined;
};

let defaultGqlInterceptUrl: string | null | undefined = null;
let defaultGqlInterceptMethod: Method | null | undefined = null;

Cypress.Commands.add(
  'gqlAssertBody',
  { prevSubject: true },
  (
    subject: Interception,
    graphQlString: string,
    variables?: GraphQLVariables
  ) => {
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
      error.message = `expected ${JSON.stringify(
        expectedQueryJson
      )} to deeply equal ${JSON.stringify(bodyQueryJson)}`;

      throw Error(error);
    }
  }
);

Cypress.Commands.add(
  'initializeGqlIntercept',
  { prevSubject: false },
  (options: InitializeOptions) => {
    defaultGqlInterceptUrl = options.url;
    defaultGqlInterceptMethod = options.method;
  }
);

Cypress.Commands.add('interceptGql', { prevSubject: false }, interceptGql);

function interceptGql(
  method: Method,
  url: string,
  operationNames: string | string[],
  response?: StaticResponse
): void;

function interceptGql(
  operationNames: string | string[],
  response?: StaticResponse
): void;

function interceptGql(...args: any[]) {
  const usesDefaultOptions = typeof args[1] === 'object';
  let method: Method;
  let url: string;
  let operationNames: string | string[];
  let response: StaticResponse | undefined;

  if (usesDefaultOptions) {
    method = defaultGqlInterceptMethod ?? 'POST';
    url = defaultGqlInterceptUrl ?? '';
    operationNames = args[0];
    response = args[1];
  } else {
    method = args[0];
    url = args[1];
    operationNames = args[3];
    response = args[4];
  }

  cy.intercept(method, url, (req) => {
    const operationArray = Array.isArray(operationNames)
      ? operationNames
      : [operationNames];

    operationArray.forEach((operation) => {
      aliasOperation(req, operation, response);
    });
  });
}

declare global {
  namespace Cypress {
    interface Chainable {
      gqlAssertBody(graphQlString: string, variables?: GraphQLVariables): void;
      initializeGqlIntercept(options: InitializeOptions): void;
      interceptGql(
        method: string,
        url: string,
        operationNames: string | string[],
        response?: StaticResponse
      ): void;
      interceptGql(
        operationNames: string | string[],
        response?: StaticResponse
      ): void;
      /**
       * @param name The name of the snapshots that will be generated
       * @param testThreshold @default 0 A number between 0 and 1 that represents the allowed percentage of pixels that can be different between the two snapshots
       * @param retryOptions @default { limit: 0, timeout: Cypress.config('defaultCommandTimeout'), delay: Cypress.config('defaultCommandTimeout') / 5 }
       * @example cy.compareSnapshot('empty-canvas', 0.1)
       */
      compareSnapshot(
        name: string,
        testThreshold?: number,
        retryOptions?: typeof RecurseDefaults
      ): Chainable<Element>;
    }
  }
}
