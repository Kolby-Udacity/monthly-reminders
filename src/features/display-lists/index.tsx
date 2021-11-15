import { FC } from 'react';
import { IconLink } from '@/components/icon-action';
import { ReminderList } from '@/types';
import { useGetListsQuery } from '@/services/lists';

export const DisplayLists: FC = () => {
  const { data: lists } = useGetListsQuery({});

  return !!lists?.length ? (
    <div className="space-y-8 w-full flex flex-col items-center">
      {lists.map((list: ReminderList) => (
        <IconLink key={list.id} text={list.title} href={`/list/${list.id}`} />
      ))}
    </div>
  ) : null;
};