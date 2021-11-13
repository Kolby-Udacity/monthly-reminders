import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useGetListsQuery } from '@/services/lists';

export const useActiveList = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: lists } = useGetListsQuery({});

  const activeList = useMemo(
    () => lists?.find((list) => list.id === id),
    [id, lists]
  );

  return { list: activeList };
};
