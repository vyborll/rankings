import { NextSeo } from 'next-seo';
import Navbar from '@root/ui/components/Navbar';

interface Props {
  title?: string;
  description?: string;
}

const Layout: React.FC<Props> = ({ title, description, children }) => {
  return (
    <>
      <NextSeo
        title={title ?? 'NFT Rankings | NFT rankings, live mints, and data'}
        description={
          description ??
          'View NFT rankings along with their data. See what projects are being minted in real time.'
        }
      />

      <Navbar />
      <div className="lg:max-w-7xl lg:mx-auto py-6 md:py-10 px-3 md:px-6 space-y-6">{children}</div>
    </>
  );
};

export default Layout;
