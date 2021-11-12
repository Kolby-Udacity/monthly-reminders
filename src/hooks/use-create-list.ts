import { useMutation, useQueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { ReminderList } from '@/types';
import { API_URL } from '@/constants';

const graphQLClient = new GraphQLClient(API_URL);

const createReminderList = (newReminderList: ReminderList) => {
  return graphQLClient.request(`
    mutation {
      createReminderList(data: { title: "${newReminderList.title}" }) {
        id
      }
    }
  `);
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newReminderList: ReminderList) => {
      return createReminderList(newReminderList);
    },
    {
      onSuccess: () => {
        // This triggers React Query to fetch and re-cache the update Lists
        queryClient.refetchQueries('reminderLists');
      },
      onError: (error: Error) => {
        console.error(`Error creating new List: ${error.message}`);
      },
    }
  );
};
