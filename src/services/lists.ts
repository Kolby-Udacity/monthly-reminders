import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { gql } from 'graphql-request';
import { z } from 'zod';

import { API_URL, DEFAULT_HEADERS } from '@/constants';
import { Reminder, ReminderList, reminderListSchema } from '@/types';

const responseSchema = z.object({ reminderLists: z.array(reminderListSchema) });
type Response = z.infer<typeof responseSchema>;

// Define a service using a base URL and expected endpoints
export const listsApi = createApi({
  reducerPath: 'listsApi',
  tagTypes: ['Lists'],
  baseQuery: graphqlRequestBaseQuery({
    url: API_URL,
    requestHeaders: { ...DEFAULT_HEADERS },
  }),
  endpoints: (builder) => ({
    getLists: builder.query<ReminderList[], unknown>({
      query: () => ({
        document: gql`
          query {
            reminderLists {
              id
              title
              reminders {
                id
                title
                due
                notes
                completed
              }
            }
          }
        `,
      }),
      providesTags: ['Lists'],
      transformResponse: (response: unknown) => {
        // Validate the unknown data
        responseSchema.parse(response);

        // Once validated we assert the type
        const validatedResponse = response as Response;

        return validatedResponse.reminderLists;
      },
    }),
    deleteList: builder.mutation<string, string>({
      query: (listId) => ({
        document: gql`
          mutation {
            deleteReminderList(where: {id: "${listId}"}) {
              id
            }
          }
        `,
      }),
      invalidatesTags: ['Lists'],
    }),
    createList: builder.mutation<string, ReminderList>({
      query: (newReminderList) => ({
        document: gql`
          mutation {
            createReminderList(data: { title: "${newReminderList.title}" }) {
              id
            }
          }
        `,
      }),
      invalidatesTags: ['Lists'],
    }),
    createReminder: builder.mutation<
      string,
      { newReminder: Reminder; reminderListId: string }
    >({
      query: ({ newReminder, reminderListId }) => ({
        document: gql`
          mutation {
            createReminder(
              data: {
                title: "${newReminder.title}"
                notes: "${newReminder.notes}"
                due: ${newReminder.due}
                completed: ${newReminder.completed}
                ckvr68ntz0dou01z9hvi5h3bz:{connect:{id:"${reminderListId}"}}}
            ) {
              id
            }
          }  
        `,
      }),
      invalidatesTags: ['Lists'],
    }),
    deleteReminder: builder.mutation<string, string>({
      query: (reminderId) => ({
        document: gql`
          mutation {
            deleteReminder(where: {id: "${reminderId}"}) {
              id
            }
          }
        `,
      }),
      invalidatesTags: ['Lists'],
    }),
    updateReminder: builder.mutation<
      string,
      { completed: boolean; reminderId: string }
    >({
      query: ({ completed, reminderId }) => ({
        document: gql`
          mutation {
            updateReminder(data: {completed: ${completed}}, where: {id: "${reminderId}"}) {
              id
            }
          }  
        `,
      }),
      invalidatesTags: ['Lists'],
    }),
  }),
});

// Export hooks for usage in functional components, which are auto-generated based on the defined endpoints
export const {
  useGetListsQuery,
  useDeleteListMutation,
  useCreateListMutation,
  useCreateReminderMutation,
  useDeleteReminderMutation,
  useUpdateReminderMutation,
} = listsApi;
