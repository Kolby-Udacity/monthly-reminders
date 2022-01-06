import { graphQlQueryToJson } from 'graphql-query-to-json';
import { DefaultRequestBody, MockedRequest } from 'msw';
import { SetupServerApi } from 'msw/node';

export const waitForRequest = (
  server: SetupServerApi,
  url: string
): Promise<MockedRequest<DefaultRequestBody>> => {
  let requestId = '';
  return new Promise((resolve, reject) => {
    server.events.on('request:start', (req) => {
      if (hasOperationName(req, url)) {
        requestId = req.id;
      }
    });
    server.events.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req);
      }
    });
    server.events.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`)
        );
      }
    });
  });
};

export const gqlAssertBody = (req: MockedRequest<any>, query: string) => {
  expect(graphQlQueryToJson(req?.body?.query)).toEqual(
    graphQlQueryToJson(query)
  );
};

export const hasOperationName = (
  req: MockedRequest<any>,
  operationName: string
) => {
  const { body } = req;
  const regex = new RegExp(`\\b${operationName}\\b`);
  return body?.query.search(regex) >= 0;
};
