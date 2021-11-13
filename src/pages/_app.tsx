import { FC } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/contexts/theme-context';
import 'tailwindcss/tailwind.css';
import '../styles/global.css';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
