import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { SkeletonTheme } from 'react-loading-skeleton';
import { StoreProvider } from 'easy-peasy';

import store from '@root/store';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import '../../styles/globals.css';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<StoreProvider store={store}>
			<SkeletonTheme color="#95959a">
				<Component {...pageProps} />
			</SkeletonTheme>
		</StoreProvider>
	);
}
export default MyApp;
