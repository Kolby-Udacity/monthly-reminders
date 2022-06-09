/// <reference types="cypress" />
import { CyHttpMessages, StaticResponse } from 'cypress/types/net-stubbing';
import { getOperationAST, parse } from 'graphql';

export * from './mocks';

export const terminalLog = (violations: any[]) => {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected`
  );

  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }));

  cy.task('table', violationData);
};

export const getOperation = (query: string) => {
  const parsedQuery = parse(query);
  const operationDefinition = getOperationAST(parsedQuery);

  return {
    name: operationDefinition.name?.value,
  };
};

export const aliasOperation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
  response?: StaticResponse
) => {
  const operation = getOperation(req.body.query);

  if (!operation.name) {
    throw new Error("Anonymous operations aren't allowed. Operation must have an operation name.");
  }

  if (operation.name === operationName) {
    req.alias = operationName;

    if (response) {
      req.reply({
        ...response,
      });
    } else {
      req.continue();
    }
  }
};
