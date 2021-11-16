import type { InferGetServerSidePropsType, NextPage } from 'next';

import prisma from '@root/utils/prisma';

import Layout from '@root/ui/components/Layout';
import Card from '@root/ui/components/Collections/Card';
import AllCollections from '@root/ui/components/Collections/All';
import { renderMarkdown } from '@root/utils/markdown';

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  collections,
  featured,
  latest,
}) => {
  return (
    <Layout>
      <div>
        <span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">
          Latest Collections
        </span>
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((feature: any, i: number) => (
          <Card key={i} featured={true} collection={feature.collection} />
        ))}
        {latest.map((collection: any, i: number) =>
          i < 9 - featured.length ? <Card key={i} featured={false} collection={collection} /> : null
        )}
      </div>

      <AllCollections collections={collections} />
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const collections = await prisma.collection.findMany({
    where: { show: true },
    select: {
      blockchain: true,
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      medias: true,
      oneDayVolume: true,
      oneDayChange: true,
      oneDaySales: true,
      oneDayAveragePrice: true,
      sevenDayVolume: true,
      sevenDayChange: true,
      sevenDaySales: true,
      sevenDayAveragePrice: true,
      thirtyDayVolume: true,
      thirtyDayChange: true,
      thirtyDaySales: true,
      thirtyDayAveragePrice: true,
      totalVolume: true,
      totalSales: true,
      totalSupply: true,
      numOwners: true,
      averagePrice: true,
      marketCap: true,
      createdAt: true,
    },
    orderBy: {
      totalVolume: 'desc',
    },
  });

  const featured = await prisma.featured.findMany({
    where: { type: 'collection', active: true },
    orderBy: { slot: 'asc' },
    select: {
      collection: {
        select: {
          blockchain: true,
          slug: true,
          name: true,
          imageUrl: true,
          description: true,
          totalSupply: true,
          medias: true,
        },
      },
    },
  });

  const latest = collections
    .sort((a: any, b: any) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, 9);

  const format = await Promise.all(
    latest.map(async (collection: any) => ({
      ...collection,
      description: await renderMarkdown(collection.description),
    }))
  );

  return {
    props: {
      collections,
      featured,
      latest: format,
    },
  };
};

export default Home;
