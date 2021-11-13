import type { InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';

import prisma from '@root/utils/prisma';

import fetcher from '@root/lib/fetcher';

import Layout from '@root/ui/components/Layout';
import Countdown from '@root/ui/components/Collections/Countdown';

const Upcoming: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  featured,
}) => {
  const { data } = useSWR('/api/drops/get', fetcher);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-3xl font-bold mb-1 border-b border-green-950 pb-1">
            Upcoming NFT Drops
          </span>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-2">
          <div>
            You can submit your upcoming NFT project to be listed on the &quot;Upcoming NFT
            Drops&quot; page for free. Just fill out the form below with all the required
            information for it to be listed.
          </div>
          <div>
            <Link href={'/drops/submit'}>
              <a className="underline font-semibold text-lg">Submit a project</a>
            </Link>
          </div>
        </div>
      </div>

      {data && data.projects && data.projects.length < 1 && featured.length < 1 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-3xl font-bold">No Upcoming Drops Found</div>
        </div>
      ) : null}

      {featured.map((drop, i: number) => (
        <Countdown key={i} featured={true} {...drop} />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data &&
          data.projects &&
          data.projects.map((drop: any, i: number) => (
            <Countdown key={i} featured={false} {...drop} />
          ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const featured = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { releaseDate: 'asc' },
    select: {
      name: true,
      image: true,
      description: true,
      price: true,
      supply: true,
      website: true,
      discord: true,
      twitterUsername: true,
      releaseDate: true,
    },
  });

  return {
    props: {
      featured,
    },
  };
};

export default Upcoming;
