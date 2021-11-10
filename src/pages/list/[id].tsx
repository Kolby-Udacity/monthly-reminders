import { useContext, useMemo } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppBar } from '@/components/app-bar';
import { useLists } from '@/hooks/use-lists';
import { ManageList } from '@/features/manage-list';
import { DisplayReminders } from '@/features/display-reminders';
import { ThemeContext } from '@/contexts/theme-context';

const List: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: lists } = useLists();
  const { themeMode } = useContext(ThemeContext);
  const selectedList = useMemo(
    () => lists?.find((list) => list.id === id),
    [id, lists]
  );

  return (
    <div
      className={` min-h-screen flex-col ${
        themeMode === 'light' ? 'bg-light' : 'bg-dark'
      }`}
    >
      <Head>
        <title>Monthly Reminders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <AppBar />
      </header>

      <main className="flex flex-col items-center justify-center py-20 w-full">
        <div className="w-full max-w-screen-md">
          <ManageList list={selectedList} />
          <div className="h-4" />
          <DisplayReminders reminders={selectedList?.reminders} />
        </div>
      </main>
    </div>
  );
};

export default List;
