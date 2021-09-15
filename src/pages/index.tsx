import type { NextPage } from 'next';
import Image from 'next/image';
import { gql, useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import Navbar from '@root/components/Navbar';
import AllCollections from '@root/components/Collections/All';

const getCollectionsQuery = gql`
  query {
    collections {
      name
      image_url
      seven_day_volume
      seven_day_sales
      total_volume
      total_sales
      total_supply
      num_owners
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(getCollectionsQuery);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-10 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-dark-800 p-4 rounded">
            {/* <div><Image src={collection} /></div> */}
            <div>Meebits</div>
          </div>
          <div className="bg-dark-800 p-4 rounded">
            {/* <div><Image src={collection} /></div> */}
            <div>Meebits</div>
          </div>
        </div>

        <AllCollections loading={loading} error={error} collections={data?.collections ?? []} />
      </div>
    </>
  );
};

export default Home;
