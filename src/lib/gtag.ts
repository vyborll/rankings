export const GA_TRACKING_ID = 'G-XNTFKRDBKR';

export const pageView = (url: string) => {
  window.gtag('config', '', {
    page_path: url,
  });
};
