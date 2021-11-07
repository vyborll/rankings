import type { NextPage } from 'next';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';

const Live: NextPage = () => {
  return (
    <>
      <Navbar />

      <Layout>
        <div>Coming Soon</div>
      </Layout>
    </>
  );
};

export default Live;
