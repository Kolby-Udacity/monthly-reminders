import { FC } from 'react';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';

import { store } from '@/store';

import 'tailwindcss/tailwind.css';
import '../styles/global.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
