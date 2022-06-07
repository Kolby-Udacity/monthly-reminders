import { useMutation, useQueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';

import { API_URL, DEFAULT_HEADERS } from '@/constants';

const graphQLClient = new GraphQLClient(API_URL, {
  headers: DEFAULT_HEADERS,
});

const deleteReminder = (reminderId: string) => {
  return graphQLClient.request(`
    mutation deleteReminder {
      deleteReminder(where: {id: "${reminderId}"}) {
        id
      }
    }
  `);
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (reminderId: string) => {
      return deleteReminder(reminderId);
    },
    {
      onSuccess: () => {
        // This triggers React Query to fetch and re-cache the update Lists
        queryClient.refetchQueries('reminderLists');
      },
      onError: (error: Error) => {
        console.error(`Error deleting Reminder: ${error.message}`);
      },
    }
  );
};
