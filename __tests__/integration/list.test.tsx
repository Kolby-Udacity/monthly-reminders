import userEvent from '@testing-library/user-event';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';

import List from '@/pages/list/[id]';

import GetListsJson from '../mocks/get-lists.json';
import { gqlAssertBody, waitForRequest } from '../utils/graphql-tools';
import { act, render, screen, within } from '../utils/test-utils';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockReturnValue({
  query: { id: 'ckwawrhuwyd0g0d27sxp5nbsl' },
  prefetch: jest.fn(() => Promise.resolve(true)),
});

const handlers = [
  graphql.query('reminderLists', (req, res, ctx) => {
    return res(ctx.data(GetListsJson));
  }),

  graphql.mutation('deleteReminder', (req, res, ctx) => {
    return res(ctx.data({}));
  }),

  graphql.mutation('updateReminder', (req, res, ctx) => {
    return res(ctx.data({}));
  }),

  graphql.mutation('deleteReminderList', (req, res, ctx) => {
    return res(ctx.data({}));
  }),

  graphql.mutation('createReminder', (req, res, ctx) => {
    return res(ctx.data({}));
  }),
];

const server = setupServer(...handlers);
let dateNowSpy: any;

describe('List Page', () => {
  beforeAll(() => {
    server.listen();
    dateNowSpy = jest
      .spyOn(Date.prototype, 'getDate')
      .mockImplementation(() => 6);
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
    dateNowSpy.mockRestore();
  });

  it('should display a reminder list and have reminder list operations', async () => {
    render(<List />);
    const deleteReminderRequest = waitForRequest(server, 'deleteReminder');
    const updateReminderRequest = waitForRequest(server, 'updateReminder');
    const createReminderRequest = waitForRequest(server, 'createReminder');

    expect(
      await screen.findByRole('row', {
        name: 'Rent 2 www.rent.com late Remove Finish',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: 'Internet 12 www.internet.com due Remove Finish',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: 'Gas 2 www.gas.com done Remove Unfinish',
      })
    ).toBeInTheDocument();

    userEvent.click(
      within(
        screen.getByRole('row', {
          name: 'Rent 2 www.rent.com late Remove Finish',
        })
      ).getByRole('button', { name: 'Remove' })
    );
    gqlAssertBody(
      await deleteReminderRequest,
      `mutation {
        deleteReminder(where: {id: "ckwd1ts34t3uw0c23p1ra6gzv"}) {
          id
        }
      }`
    );

    userEvent.click(
      within(
        screen.getByRole('row', {
          name: 'Rent 2 www.rent.com late Remove Finish',
        })
      ).getByRole('button', { name: 'Finish' })
    );
    gqlAssertBody(
      await updateReminderRequest,
      `mutation {
        updateReminder(data: {completed: true}, where: {id: "ckwd1ts34t3uw0c23p1ra6gzv"}) {
          id
        }
      }`
    );

    const unfinishReminderRequest = waitForRequest(server, 'updateReminder');
    userEvent.click(
      within(
        await screen.findByRole('row', {
          name: 'Gas 2 www.gas.com done Remove Unfinish',
        })
      ).getByRole('button', { name: 'Unfinish' })
    );

    gqlAssertBody(
      await unfinishReminderRequest,
      `mutation {
        updateReminder(data: {completed: false}, where: {id: "ckwz3ood4ew270b2887wh7a6z"}) {
          id
        }
      }`
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Create Reminder Item' })
    );
    userEvent.type(
      await screen.findByRole('textbox', { name: 'title' }),
      'List Item Title'
    );
    userEvent.type(screen.getByRole('spinbutton', { name: 'due' }), '3');
    userEvent.type(
      screen.getByRole('textbox', { name: 'notes' }),
      'List Item Notes'
    );
    userEvent.click(screen.getByRole('button', { name: 'Create reminder' }));

    await act(async () => {
      gqlAssertBody(
        await createReminderRequest,
        `mutation {
          createReminder(
            data: {
              title: "List Item Title"
              notes: "List Item Notes"
              due: 3
              completed: false
              ckvr68ntz0dou01z9hvi5h3bz:{connect:{id:"ckwawrhuwyd0g0d27sxp5nbsl"}}}
          ) {
            id
          }
        }`
      );
    });

    userEvent.click(
      await screen.findByRole('button', { name: 'Delete Reminder List' })
    );

    await act(async () => {
      gqlAssertBody(
        await waitForRequest(server, 'deleteReminderList'),
        `mutation {
        deleteReminderList(where: {id: "ckwawrhuwyd0g0d27sxp5nbsl"}) {
          id
        }
      }`
      );
    });
  });
});
