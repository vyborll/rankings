import type { AppProps } from 'next/app';
import Router from 'next/router';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import { SkeletonTheme } from 'react-loading-skeleton';
import { StoreProvider } from 'easy-peasy';

import store from '@root/store';

export const client = new ApolloClient({
  uri: 'https://nftranks.vercel.app/api/graphql',
  cache: new InMemoryCache(),
});

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import '../../styles/globals.css';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <ApolloProvider client={client}>
        <SkeletonTheme color="#95959a">
          <Component {...pageProps} />
        </SkeletonTheme>
      </ApolloProvider>
    </StoreProvider>
  );
}
export default MyApp;
