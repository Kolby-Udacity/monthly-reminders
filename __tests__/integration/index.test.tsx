import userEvent from '@testing-library/user-event';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';

import GetListsJson from '@/__tests__/mocks/get-lists.json';
import { gqlAssertBody, waitForRequest } from '@/__tests__/utils/graphql-tools';
import { act, render, screen } from '@/__tests__/utils/test-utils';
import Home from '@/pages/index';

const handlers = [
  graphql.query('reminderLists', (req, res, ctx) => {
    return res(ctx.data(GetListsJson));
  }),

  graphql.mutation('createReminderList', (req, res, ctx) => {
    return res(ctx.data({}));
  }),
];

const server = setupServer(...handlers);

describe('Home Page', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should display the landing page and add a new reminder list', async () => {
    render(<Home />);

    expect(await screen.findByText('Bills')).toBeInTheDocument();
    expect(await screen.findByText('Chores')).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', { name: 'Create a reminder list' })
    );

    userEvent.type(
      await screen.findByRole('textbox', { name: 'title' }),
      'List Name'
    );

    userEvent.click(screen.getByRole('button', { name: 'Create list' }));

    const createReminderListRequest = waitForRequest(
      server,
      'createReminderList'
    );

    await act(async () => {
      gqlAssertBody(
        await createReminderListRequest,
        `mutation {
        createReminderList(data: { title: "List Name" }) {
          id
        }
      }`
      );
    });
  });
});
