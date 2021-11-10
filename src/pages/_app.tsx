import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Script from 'next/script';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { SkeletonTheme } from 'react-loading-skeleton';
import { StoreProvider } from 'easy-peasy';

import store from '@root/store';
import * as gtag from '@root/lib/gtag';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import '../../styles/globals.css';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => gtag.pageView(url);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <StoreProvider store={store}>
        <SkeletonTheme color="rgba(50, 53, 62, 0.75)" highlightColor="rgba(50, 53, 62, 1)">
          <Component {...pageProps} />
        </SkeletonTheme>
      </StoreProvider>
    </>
  );
}
export default MyApp;
