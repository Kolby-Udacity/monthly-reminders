import { useMutation, useQueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';

import { API_URL } from '@/constants';
import { Reminder } from '@/types';

const graphQLClient = new GraphQLClient(API_URL);

const createReminderList = (newReminder: Reminder, reminderListId: string) => {
  return graphQLClient.request(`
    mutation createReminder {
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
  `);
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      newReminder,
      reminderListId,
    }: {
      newReminder: Reminder;
      reminderListId: string;
    }) => {
      return createReminderList(newReminder, reminderListId);
    },
    {
      onSuccess: () => {
        // This triggers React Query to fetch and re-cache the update Lists
        queryClient.refetchQueries('reminderLists');
      },
      onError: (error: Error) => {
        console.error(`Error creating new Reminder: ${error.message}`);
      },
    }
  );
};
