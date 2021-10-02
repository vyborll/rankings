import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { gql, useQuery } from '@apollo/client';
import { ExternalLinkIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

import Asset from '@root/ui/components/Modal/Asset';

import Navbar from '@root/ui/components/Navbar';

const getCollectionQuery = gql`
  query Collection($slug: String!, $traits: Boolean!) {
    collection(slug: $slug) {
      name
      description
      externalUrl
      discordUrl
      twitterUsername
      slug
      bannerImageUrl
      totalVolume
      totalSupply
      sevenDayVolume
      sevenDaySales
      numOwners
    }

    assets(slug: $slug, traits: $traits) {
      tokenId
      name
      imageUrl
      traits {
        traitCount
        traitType
        value
      }
    }
  }
`;

interface Asset {
  id: number;
  rank: number;
  name: string;
  img: string;
}

const assets: Asset[] = [
  {
    id: 8348,
    rank: 1,
    name: 'CryptoPunk #8348',
    img: 'https://lh3.googleusercontent.com/UqVrmocoMvyWMsc5ImUrl47SOOwCkpPBFRjJ9sh-TzCmu4cMmJ-dcq4iOfxGG6HwDzd7B2Y5172yrUmNA1NlXT43tC8PSlkCNusf7Q=w600',
  },
  {
    id: 7804,
    rank: 2,
    name: 'CryptoPunk #7804',
    img: 'https://lh3.googleusercontent.com/mR1utxNugWurPayNNDqc5Dmk4gO7WTpdmlMN-9N3rdrC3hIl-8Z2lEpBtX6D9mPry8uDDrBNYDjNaFHHdFE9HVWL6_htFwL7-KXj=w600',
  },
  {
    id: 7523,
    rank: 3,
    name: 'CryptoPunk #7523',
    img: 'https://lh3.googleusercontent.com/b8aFlRYUutccoWL9Tkt-FYhWkx901zwFip2fjaUexZ_PKCv1zHPwJbeK6hI8_rLgqw751jCZrv1i7UNYa3UyjqM1LM5cIVEa5DmR2Q=w600',
  },
  {
    id: 3443,
    rank: 4,
    name: 'CryptoPunk #3443',
    img: 'https://lh3.googleusercontent.com/Jp_9jFMDlCnE4ezocQVsCZRC6G1j03k3jkxtYVTqrkqmMJPbkBWX3_INq4n0irrf8FEEmv-_3dITC7xkIDXZzl3_1pMdTkYoeYM1DrQ=w600',
  },
  {
    id: 5905,
    rank: 5,
    name: 'CryptoPunk #5905',
    img: 'https://lh3.googleusercontent.com/ekHvZOntmYJWwS59J4oWE1qhMx3rUuYas2ddT69jJDx2hGuYYZIydzXvllLdFWIfOMXhPotoRp4e5OzmEQYq5PkVjoqkUY-6hnZbCQ=w600',
  },
];

const Slug: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ slug }) => {
  const [isAssetOpen, setAssetOpen] = useState(false);
  const [assetData, setAssetData] = useState<Asset | null>(null);

  const { loading, error, data } = useQuery(getCollectionQuery, {
    variables: {
      slug,
      traits: true,
    },
  });

  console.log(data);

  const setModal = (open: boolean) => {
    setAssetOpen(open);
  };

  return (
    <>
      <Navbar />

      <div className="lg:max-w-7xl lg:mx-auto py-6 md:py-10 px-3 md:px-6 space-y-6">
        {loading ? (
          <>
            <Skeleton className="w-full h-80 rounded" duration={2} count={1} />

            <div className="space-y-4">
              <div className="w-96">
                <Skeleton className="text-3xl font-bold" duration={2} count={1} />
              </div>
              <div className="w-full h-14">
                <Skeleton className="h-full text-lg font-light" duration={2} count={1} />
              </div>
            </div>

            <div className="flex flex-row space-x-6">
              <div className="w-40">
                <Skeleton className="h-8" duration={2} count={1} />
              </div>
              <div className="w-40">
                <Skeleton className="h-8" duration={2} count={1} />
              </div>
              <div className="w-40">
                <Skeleton className="h-8" duration={2} count={1} />
              </div>
            </div>
          </>
        ) : null}

        {!loading && data ? (
          <>
            <div className="relative w-full h-32 sm:h-40 md:h-60 lg:h-80">
              <Image src={data.collection.bannerImageUrl} layout="fill" className="object-cover rounded" />
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold">{data.collection.name}</div>
              <div className="text-sm md:text-lg font-light">{data.collection.description}</div>
            </div>

            <div className="flex flex-row space-x-6">
              {data.collection?.externalUrl ? (
                <Link href={data.collection.externalUrl}>
                  <a target="_blank" className="text-sm flex flex-row items-center underline">
                    <ExternalLinkIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Website
                  </a>
                </Link>
              ) : null}

              {data.collection?.twitterUsername ? (
                <Link href={`https://twitter.com/${data.collection.twitterUsername}`}>
                  <a target="_blank" className="text-sm flex flex-row items-center underline">
                    <svg className="h-4 w-4 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>Twitter</title>
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </a>
                </Link>
              ) : null}

              {data.collection?.discordUrl ? (
                <Link href={data.collection.discordUrl}>
                  <a target="_blank" className="text-sm flex flex-row items-center underline">
                    <svg className="h-4 w-4 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>Discord</title>
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    Discord
                  </a>
                </Link>
              ) : null}
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Total Volume</div>
                  <div className="text-xl md:text-2xl font-semibold">{data.collection.totalVolume.toLocaleString()} ETH</div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Unique Owners</div>
                  <div className="text-xl md:text-2xl font-semibold">{data.collection.numOwners.toLocaleString()}</div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Volume (7d)</div>
                  <div className="text-xl md:text-2xl font-semibold">{data.collection.sevenDayVolume.toLocaleString()} ETH</div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Sales (7d)</div>
                  <div className="text-xl md:text-2xl font-semibold">{data.collection.sevenDaySales.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xl md:text-2xl font-semibold mt-14 mb-4">{data.collection.totalSupply.toLocaleString()} Total Assets</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 items-center">
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 relative rounded shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="sm:text-sm">
                      <SearchIcon className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <input className="bg-dark-800 rounded pl-10 py-3 pr-10 w-full focus:outline-none" placeholder="Search for an asset" />
                  <div className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer">
                    <span className="sm:text-sm">
                      <XIcon className="h-4 w-4 text-white" />
                    </span>
                  </div>
                </div>

                <div className="h-full w-full">
                  <button className="bg-green-960 rounded h-full w-full">Search</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.assets.map((asset: any, i: number) => (
                  <motion.div
                    whileHover={{ y: '-2%' }}
                    key={i}
                    className="bg-dark-800 p-4 rounded space-y-2 cursor-pointer"
                    onClick={() => {
                      setAssetData(asset);
                      setAssetOpen(true);
                    }}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center text-sm text-green-940 font-bold">#{i + 1}</div>
                      <div className="text-sm text-gray-200 font-bold">ID: {asset.tokenId}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <img
                        src={asset.imageUrl}
                        style={{
                          height: 140,
                          width: 140,
                        }}
                        className="rounded"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-sm font-semibold truncate">{asset.name}</div>
                      <div className="bg-green-960 text-green-940 py-1 text-sm font-semibold rounded">Rarity Score: 241.48</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <Asset isOpen={isAssetOpen} setModal={setModal} asset={assetData} />
    </>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      slug: ctx.params?.slug,
    },
  };
};

export default Slug;
