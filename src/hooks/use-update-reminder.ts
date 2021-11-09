import { useMutation, useQueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';
import { API_URL } from '@/constants';

const graphQLClient = new GraphQLClient(API_URL);

const updateReminder = (reminderId: string, completed: boolean) => {
  return graphQLClient.request(`
    mutation {
      updateReminder(data: {completed: ${completed}}, where: {id: "${reminderId}"}) {
        id
      }
    }  
  `);
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ reminderId, completed }: { reminderId: string; completed: boolean }) => {
      return updateReminder(reminderId, completed);
    },
    {
      onSuccess: () => {
        // This triggers React Query to fetch and re-cache the update Lists
        queryClient.refetchQueries('reminderLists');
      },
      onError: (error: Error) => {
        console.error(`Error updating Reminder: ${error.message}`);
      },
    }
  );
};
