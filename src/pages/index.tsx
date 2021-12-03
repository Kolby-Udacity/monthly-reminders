import { useSelector } from 'react-redux';
import type { NextPage } from 'next';
import Head from 'next/head';

import { AppBar } from '@/components/app-bar';
import { CreateList } from '@/features/create-list';
import { DisplayLists } from '@/features/display-lists';
import { RootState } from '@/store';

const Home: NextPage = () => {
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <div
      className={` min-h-screen flex-col ${
        theme.mode === 'light' ? 'bg-light' : 'bg-dark'
      }`}
    >
      <Head>
        <title>Monthly Reminders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <AppBar />
      </header>

      <main className="flex flex-col w-full items-center py-20">
        <DisplayLists />
        <div className="h-8" />
        <CreateList />
      </main>
    </div>
  );
};

export default Home;
