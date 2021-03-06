import { useContext } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import { AppBar } from '@/components/app-bar';
import { ThemeContext } from '@/contexts/theme-context';
import { ManageList } from '@/features/manage-list';
import { ManageReminders } from '@/features/manage-reminders';
import { useActiveList } from '@/hooks/use-active-list';

const List: NextPage = () => {
  const { list } = useActiveList();
  const { themeMode } = useContext(ThemeContext);

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
          <ManageList list={list} />
          <div className="h-4" />
          <ManageReminders reminders={list?.reminders} />
        </div>
      </main>
    </div>
  );
};

export default List;
