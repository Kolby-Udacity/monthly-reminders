import { useMutation, useQueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';

import { API_URL, DEFAULT_HEADERS } from '@/constants';

const graphQLClient = new GraphQLClient(API_URL, {
  headers: DEFAULT_HEADERS,
});

const deleteReminderList = (listId: string) => {
  return graphQLClient.request(`
    mutation deleteReminderList {
      deleteReminderList(where: {id: "${listId}"}) {
        id
      }
    }
  `);
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (listId: string) => {
      return deleteReminderList(listId);
    },
    {
      onSuccess: () => {
        // This triggers React Query to fetch and re-cache the update Lists
        queryClient.refetchQueries('reminderLists');
      },
      onError: (error: Error) => {
        console.error(`Error deleting List: ${error.message}`);
      },
    }
  );
};
