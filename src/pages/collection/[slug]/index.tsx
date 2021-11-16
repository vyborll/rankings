import type { NextPage, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import cn from 'classnames';

import prisma from '@root/utils/prisma';
import { renderMarkdown } from '@root/utils/markdown';

import Layout from '@root/ui/components/Layout';
import MarkdownLink from '@root/ui/components/Markdown/Link';

const components = { ...MarkdownLink };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Overview: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  collection,
  source,
}) => {
  const [categories] = useState(['Stats', 'Rankings', 'Activity']);
  const [tabs, setTabs] = useState([
    { name: 'Stats', selected: true },
    { name: 'Activity', selected: false },
    { name: 'Rankings', selected: false },
  ]);

  const switchTabs = (name: string) => {
    const currentTab = tabs.find(x => x.name === name);
    if (currentTab?.selected === true) return;

    setTabs(
      tabs.map(x => (x.name !== name ? { ...x, selected: false } : { ...x, selected: true }))
    );
  };

  return (
    <Layout title={`NFT Rankings | ${collection?.name}`}>
      <div className="relative w-full h-32 sm:h-40 md:h-60 lg:h-80">
        <Image
          src={collection?.bannerImageUrl ?? ''}
          layout="fill"
          className="object-cover rounded"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-row items-center space-x-2">
          <img src={collection?.imageUrl ?? ''} className="h-16 w-16" />
          <div className="text-3xl font-bold">{collection?.name}</div>
        </div>
        <div>
          <div className="flex flex-row items-center space-x-2">
            <span className="flex flex-row items-center bg-dark-800 space-x-1 px-3 py-1 text-sm rounded-sm">
              <svg
                className="h-3 w-3 fill-current text-green-940"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{collection?.blockchain}</title>
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              <span className="text-green-940">{collection?.blockchain}</span>
            </span>
            <span className="truncate flex flex-row items-center bg-dark-800 space-x-1 px-3 py-1 text-sm rounded-sm">
              <span>{`${collection?.contracts[0].substring(
                0,
                6
              )}...${collection?.contracts[0].substring(
                collection?.contracts[0].length - 6
              )}`}</span>
              <a
                href={`https://etherscan.io/address/${collection?.contracts[0]}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon className="h-4 w-4 cursor-pointer" />
              </a>
            </span>
          </div>
        </div>
        <div className="text-sm md:text-lg font-light">
          <MDXRemote {...(source as any)} components={components} />
        </div>
      </div>

      <div className="flex flex-row space-x-6">
        {collection?.slug ? (
          <a
            className="text-sm flex flex-row items-center underline"
            href={`https://opensea.io/collection/${collection.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              viewBox="0 0 90 90"
            >
              <path
                d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                fill="#2081E2"
              />
              <path
                d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                fill="white"
              />
              <path
                d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                fill="white"
              />
            </svg>
            OpenSea
          </a>
        ) : null}

        {(collection?.medias as any)?.externalUrl ? (
          <Link href={(collection?.medias as any)?.externalUrl}>
            <a target="_blank" className="text-sm flex flex-row items-center underline">
              <ExternalLinkIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Website
            </a>
          </Link>
        ) : null}

        {(collection?.medias as any)?.twitterUsername ? (
          <Link href={`https://twitter.com/${(collection?.medias as any)?.twitterUsername}`}>
            <a target="_blank" className="text-sm flex flex-row items-center underline">
              <svg
                className="h-4 w-4 mr-2 fill-current"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Twitter</title>
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </a>
          </Link>
        ) : null}

        {(collection?.medias as any)?.discordUrl ? (
          <Link href={(collection?.medias as any)?.discordUrl}>
            <a target="_blank" className="text-sm flex flex-row items-center underline">
              <svg
                className="h-4 w-4 mr-2 fill-current"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Discord</title>
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Discord
            </a>
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          name="Change (24h)"
          eth={false}
          color={Math.sign(collection?.oneDayChange ?? 0) === -1 ? 'red' : 'green'}
          value={
            collection?.oneDayChange.toLocaleString('en', {
              style: 'percent',
              maximumFractionDigits: 2,
            }) ?? 0
          }
        />
        <StatCard
          name="Volume (24h)"
          eth={true}
          color="green"
          value={collection?.oneDayVolume.toFixed(3) ?? 0}
        />
        <StatCard
          name="Average Price (24h)"
          eth={true}
          color="green"
          value={`${collection?.oneDayAveragePrice.toFixed(3) ?? 0}`}
        />
        <StatCard
          name="Sales (24h)"
          eth={false}
          color="green"
          value={`${collection?.oneDaySales}`}
        />
      </div>

      <div className="flex w-full max-w-md py-2">
        {tabs.map((tab, idx) =>
          tab.name === 'Rankings' ? (
            <Link key={idx} href={`/collection/${collection?.slug}/ranks`}>
              <a className="flex flex-1 items-center justify-center p-1 text-lg leading-5 font-medium px-6 py-3 rounded space-x-1">
                {tab.name}
              </a>
            </Link>
          ) : (
            <button
              key={idx}
              className={cn(
                'flex flex-1 items-center justify-center p-1 text-lg leading-5 font-medium px-6 py-3 rounded space-x-1',
                {
                  'bg-dark-800 shadow': tab.selected,
                }
              )}
              onClick={() => switchTabs(tab.name)}
            >
              {tab.name}
            </button>
          )
        )}
      </div>

      <div>
        {tabs.map((x, idx) => {
          if (x.selected === true) {
            if (x.name === 'Stats') {
              return <Stat />;
            } else if (x.name === 'Activity') {
              return <Activity />;
            }
          } else {
            return null;
          }
        })}
      </div>
    </Layout>
  );
};

const Stat: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-60">
      <div>Coming Soon</div>
    </div>
  );
};

const Activity: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-60">
      <div>Coming Soon</div>
    </div>
  );
};

const StatCard: React.FC<{
  name: string;
  eth: boolean;
  color: 'green' | 'red';
  value: number | string;
}> = ({ name, eth, color, value }) => {
  return (
    <div className="bg-dark-800 p-4 rounded">
      <div className="text-sm md:text-base">{name}</div>
      <div
        className={cn('text-xl md:text-2xl font-semibold flex flex-row items-center', {
          'text-green-940': color === 'green',
          'text-red-400': color === 'red',
        })}
      >
        {eth ? (
          <svg
            className="h-4 w-4 mr-1 fill-current text-green-940"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>ETH</title>
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
          </svg>
        ) : null}
        {value}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug as string;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: {
      blockchain: true,
      name: true,
      slug: true,
      description: true,
      contracts: true,
      medias: true,
      bannerImageUrl: true,
      imageUrl: true,
      totalVolume: true,
      totalSupply: true,
      oneDayAveragePrice: true,
      oneDayChange: true,
      oneDaySales: true,
      oneDayVolume: true,
      sevenDayAveragePrice: true,
      sevenDayChange: true,
      sevenDaySales: true,
      sevenDayVolume: true,
      thirtyDayAveragePrice: true,
      thirtyDayChange: true,
      thirtyDaySales: true,
      thirtyDayVolume: true,
      numOwners: true,
      totalSales: true,
      marketCap: true,
      averagePrice: true,
    },
  });

  if (!collection) {
    ctx.res.setHeader('location', 'https://nftrankings.net');
    ctx.res.statusCode = 302;
    ctx.res.end();

    return {
      props: {},
    };
  }

  const source = await renderMarkdown(collection.description);

  return {
    props: {
      collection,
      source,
    },
  };
};

export default Overview;
