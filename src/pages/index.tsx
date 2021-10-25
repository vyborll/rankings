import type { NextPage } from 'next';
import { gql, useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';

import Card from '@root/ui/components/Collections/Card';

import AllCollections from '@root/ui/components/Collections/All';

const getCollectionsQuery = gql`
  query {
    featured {
      collection {
        name
        slug
        imageUrl
        description
        totalSupply
        externalUrl
        discordUrl
        twitterUsername
      }
    }

    collectionsLatest {
      name
      slug
      imageUrl
      description
      totalSupply
      externalUrl
      discordUrl
      twitterUsername
    }

    collections {
      name
      slug
      imageUrl
      description
      sevenDayVolume
      sevenDaySales
      totalVolume
      totalSales
      totalSupply
      numOwners
      externalUrl
      discordUrl
      twitterUsername
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(getCollectionsQuery);

  return (
    <>
      <Navbar />

      <Layout>
        <div>
          <span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">Featured Collections</span>
        </div>

        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading &&
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-dark-800 p-4 rounded space-y-4">
                <div className="flex flex-row items-center">
                  <div className="w-20">
                    <Skeleton className="h-20" duration={2} count={1} />
                  </div>
                  <div className="pl-4">
                    <div className="w-20">
                      <Skeleton className="h-4" duration={2} count={1} />
                    </div>
                    <div className="w-32">
                      <Skeleton className="h-6 w-40" duration={2} count={1} />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <Skeleton className="h-4" duration={2} count={3} />
                </div>
                <div className="flex flex-row space-x-4">
                  <div className="w-20">
                    <Skeleton className="h-4" duration={2} count={1} />
                  </div>
                  <div className="w-20">
                    <Skeleton className="h-4" duration={2} count={1} />
                  </div>
                  <div className="w-20">
                    <Skeleton className="h-4" duration={2} count={1} />
                  </div>
                </div>
                <div className="w-full">
                  <Skeleton className="h-9" />
                </div>
              </div>
            ))}
          {!loading && data.featured.map((feature: any, i: number) => <Card key={i} featured={true} collection={feature.collection} />)}
          {!loading &&
            data.collectionsLatest.map((collection: any, i: number) =>
              i < 9 - data.featured.length ? <Card key={i} featured={false} collection={collection} /> : null
            )}
        </div>

        <AllCollections loading={loading} error={error} collections={data?.collections ?? []} />
      </Layout>
    </>
  );
};

export default Home;
