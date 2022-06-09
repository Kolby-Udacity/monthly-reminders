import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useLists } from '@/services';

export const useActiveList = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: lists } = useLists();

  const activeList = useMemo(() => lists?.find((list) => list.id === id), [id, lists]);

  return { list: activeList };
};
