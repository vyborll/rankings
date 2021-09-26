import type { AppProps } from 'next/app';
import Router from 'next/router';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import { SkeletonTheme } from 'react-loading-skeleton';

export const client = new ApolloClient({
	uri: 'http://localhost:3000/api/graphql',
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
		<ApolloProvider client={client}>
			<SkeletonTheme color="#95959a">
				<Component {...pageProps} />
			</SkeletonTheme>
		</ApolloProvider>
	);
}
export default MyApp;
