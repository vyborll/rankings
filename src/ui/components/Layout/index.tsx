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
        title={title ?? 'NFTRankings | View NFT Rankings and Upcoming NFT Drops'}
        description={description ?? 'View NFT rankings, rarities, and upcoming NFT drops.'}
      />

      <Navbar />
      <div className="lg:max-w-7xl lg:mx-auto py-6 md:py-10 px-3 md:px-6 space-y-6">{children}</div>
    </>
  );
};

export default Layout;
