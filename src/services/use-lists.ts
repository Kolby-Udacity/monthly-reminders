import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { gql, GraphQLClient } from 'graphql-request';
import { z } from 'zod';

import { API_URL, DEFAULT_HEADERS } from '@/constants';
import { ReminderList,reminderListSchema } from '@/types';

const graphQLClient = new GraphQLClient(API_URL, {
  headers: { ...DEFAULT_HEADERS },
});

const query = gql`
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
`;

export const useLists = () => {
  const { data, error, isFetching } = useQuery<ReminderList[], Error>(
    'reminderLists',
    async () => {
      const { reminderLists } = await graphQLClient.request(query);

      // Validate the unknown data
      z.array(reminderListSchema).parse(reminderLists);

      // Once validated we assert the type
      return reminderLists as ReminderList[];
    }
  );

  useEffect(() => {
    if (error) console.error(`Error fetching Lists: ${error.message}`);
  }, [error]);

  return { data, error, isFetching };
};
