import { FC } from 'react';

import { IconLink } from '@/components/icon-action';
import { useLists } from '@/services';
import { ReminderList } from '@/types';

export const DisplayLists: FC = () => {
  const { data: lists } = useLists();

  return !!lists?.length ? (
    <div className="space-y-8 w-full flex flex-col items-center">
      {lists.map((list: ReminderList) => (
        <IconLink key={list.id} text={list.title} href={`/list/${list.id}`} />
      ))}
    </div>
  ) : null;
};
