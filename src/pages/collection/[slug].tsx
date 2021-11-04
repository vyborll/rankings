import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import {
  ExternalLinkIcon,
  SearchIcon,
  XIcon,
  ChevronDownIcon,
  FilterIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { MDXRemote } from 'next-mdx-remote';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

import prisma from '@root/utils/lib/prisma';
import { getAssets, getCollection } from '@root/utils/cache';

import { useStoreState, useStoreActions } from '@root/store';

import MarkdownLink from '@root/ui/components/Markdown/Link';
import Asset from '@root/ui/components/Modal/Asset';
import Navbar from '@root/ui/components/Navbar';
import { renderMarkdown } from '@root/utils/markdown';

const components = { ...MarkdownLink };

interface Collection {
  name: string;
  description: string;
  contractAddress: string;
  externalUrl: string;
  discordUrl: string;
  twitterUsername: string;
  slug: string;
  bannerImageUrl: string;
  totalVolume: number;
  totalSupply: number;
  sevenDayVolume: number;
  sevenDaySales: number;
  numOwners: number;
}

interface IAsset {
  tokenId: string;
  name: string;
  imageUrl: string;
  defaultRank: number;
  defaultScore: number;
  traits: {
    attributeType: string;
    traitType: string;
    traitCount: number;
    defaultScore: number;
    percentile: number;
  }[];
}

const Slug: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  collection,
  attributes,
  assets: initialAssets,
  source,
  maxPage,
}) => {
  const [data, setData] = useState<{
    loading: boolean;
    assets: IAsset[];
    page: number;
    maxPage: number;
  }>({
    loading: false,
    assets: initialAssets ?? [],
    page: 1,
    maxPage: maxPage ?? 1,
  });
  const [search, setSearch] = useState<string>('');
  const [filters, setFilters] = useState(attributes!);
  const [selectedFilters, setSelectedFilters] = useState<{ attribute: string; trait: string }[]>(
    []
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const modal = useStoreState(state => state.modal);
  const setShow = useStoreActions(actions => actions.modal.setShow);
  const setAsset = useStoreActions(actions => actions.modal.setAsset);

  const onSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (data.loading) return;

    if (!search || search === '') return;
    if (isNaN(Number(search))) return;
    if (data.assets.length === 1 && parseInt(data.assets[0].tokenId) === parseInt(search)) return;

    setData({ ...data, loading: true });

    try {
      const response = await axios.get('/api/collection/asset', {
        params: { slug: collection.slug, tokenId: Number(search) },
      });

      setData({
        ...data,
        assets: [response.data.asset as IAsset],
        page: 1,
        maxPage: 1,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setData({ ...data, loading: false });
    }
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearch(e.currentTarget.value);
  };

  const clearInput = async () => {
    setSearch('');
    setData({
      ...data,
      assets: initialAssets ?? [],
      page: 1,
      maxPage: maxPage ?? 1,
      loading: false,
    });
  };

  const loadMore = async (): Promise<void> => {
    if (data.loading) return;
    if (data.page >= data.maxPage) return;

    setData({ ...data, loading: true });

    if (selectedFilters.length === 0) {
      try {
        const response = await axios.get('/api/collection/assets', {
          params: { slug: collection.slug, page: data.page + 1 },
        });

        setData({
          ...data,
          assets: [...data.assets, ...response.data.assets],
          page: response.data.page,
          maxPage: response.data.maxPage,
          loading: false,
        });
      } catch (err) {
        setData({
          ...data,
          loading: false,
        });
        console.error(err);
      }
    } else {
      try {
        const params = new URLSearchParams();

        params.append('slug', collection.slug);
        params.append('page', (data.page + 1).toString());
        selectedFilters.map(f => params.append(f.attribute, f.trait));

        const response = await axios.get('/api/collection/assets', {
          params,
        });

        setData({
          ...data,
          assets: [...data.assets, ...response.data.assets],
          page: response.data.page,
          maxPage: response.data.maxPage,
          loading: false,
        });
      } catch (err) {
        setData({
          ...data,
          loading: false,
        });
        console.error(err);
      }
    }
  };

  const selectTrait = async (e: React.FormEvent<HTMLInputElement>) => {
    const [attribute, trait] = e.currentTarget.name.split('|');

    const params = new URLSearchParams();

    setData({ ...data, loading: true });

    if (e.currentTarget.checked) {
      const data = [...selectedFilters, { attribute, trait }];
      params.append('slug', collection.slug);
      params.append('page', '1');
      data.map(d => params.append(d.attribute, d.trait));

      const updated = filters.map(x => {
        if (x.attributeType === attribute) {
          const traits = x.trait.map(t => {
            if (t.traitType === trait) {
              return { ...t, selected: true };
            } else {
              return { ...t };
            }
          });

          return { ...x, trait: traits };
        } else {
          return { ...x };
        }
      });

      setFilters(updated);
      setSelectedFilters(data ?? []);

      const response = await axios.get('/api/collection/assets', {
        params,
      });

      setData({
        ...data,
        assets: response.data.assets ?? [],
        page: response.data.page,
        maxPage: response.data.maxPage,
        loading: false,
      });
    } else {
      const data = [...selectedFilters.filter(x => x.trait !== trait)];
      params.append('slug', collection.slug);
      params.append('page', '1');
      data.map(d => params.append(d.attribute, d.trait));

      const updated = filters.map(x => {
        if (x.attributeType === attribute) {
          const traits = x.trait.map(t => {
            if (t.traitType === trait) {
              return { ...t, selected: false };
            } else {
              return { ...t };
            }
          });

          return { ...x, trait: traits };
        } else {
          return { ...x };
        }
      });

      setFilters(updated);
      setSelectedFilters(data ?? []);

      console.log(params);

      const response = await axios.get('/api/collection/assets', {
        params,
      });

      setData({
        ...data,
        assets: response.data.assets,
        page: response.data.page,
        maxPage: response.data.maxPage,
        loading: false,
      });
    }
  };

  return (
    <>
      <Navbar />

      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="mr-auto relative max-w-xs w-full h-full bg-dark-950 shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-200">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 w-10 h-10 p-2 rounded-md flex items-center justify-center text-gray-200 hover:text-gray-300"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 px-4">
                {filters
                  ?.sort((a, b) => a.attributeType.localeCompare(b.attributeType))
                  .map(attribute => (
                    <Disclosure
                      as="div"
                      key={attribute.attributeType}
                      className="border-b border-divider-900 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="py-2 w-full flex items-center text-sm text-gray-200 hover:text-gray-300">
                              <span className="mr-1 flex items-center">
                                {open ? (
                                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                              <span className="font-medium text-white">
                                {attribute.attributeType}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-2">
                              {attribute.trait.map((trait, id) =>
                                trait.traitCount > 0 ? (
                                  <div key={trait.traitType} className="flex items-center">
                                    <input
                                      id={`filter-${attribute.attributeType}-${id}`}
                                      name={`${attribute.attributeType}|${trait.traitType}`}
                                      defaultValue={trait.traitType}
                                      type="checkbox"
                                      defaultChecked={trait.selected}
                                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                      onChange={e => selectTrait(e)}
                                    />
                                    <label
                                      htmlFor={`filter-${attribute.attributeType}-${id}`}
                                      className="ml-3 text-sm text-gray-100"
                                    >
                                      {trait.traitType} ({trait.traitCount})
                                    </label>
                                  </div>
                                ) : null
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:flex flex-1 h-screen overflow-hidden lg:w-64 py-6 fixed border-r border-divider-900">
        <div className="flex-1 overflow-y-scroll px-6 pb-12 no-scrollbar">
          <form className="hidden lg:block">
            <div>
              <div className="font-bold text-lg">Filters</div>
            </div>
            {filters
              ?.sort((a, b) => a.attributeType.localeCompare(b.attributeType))
              .map(attribute => (
                <Disclosure
                  as="div"
                  key={attribute.attributeType}
                  className="border-b border-divider-900 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="py-2 w-full flex items-center text-sm text-gray-200 hover:text-gray-300">
                          <span className="mr-1 flex items-center">
                            {open ? (
                              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                          <span className="font-medium text-white">{attribute.attributeType}</span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-2">
                          {attribute.trait.map((trait, id) =>
                            trait.traitCount > 0 ? (
                              <div key={trait.traitType} className="flex items-center">
                                <input
                                  id={`filter-${attribute.attributeType}-${id}`}
                                  name={`${attribute.attributeType}|${trait.traitType}`}
                                  defaultValue={trait.traitType}
                                  type="checkbox"
                                  defaultChecked={trait.selected}
                                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                  onChange={e => selectTrait(e)}
                                />
                                <label
                                  htmlFor={`filter-${attribute.attributeType}-${id}`}
                                  className="ml-3 text-sm text-gray-100"
                                >
                                  {trait.traitType} ({trait.traitCount})
                                </label>
                              </div>
                            ) : null
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
          </form>
        </div>
      </div>

      <div className="lg:ml-64 p-6 space-y-6">
        {data.assets && collection ? (
          <>
            <div className="relative w-full h-32 sm:h-40 md:h-60 lg:h-80">
              <Image
                src={collection.bannerImageUrl ?? ''}
                layout="fill"
                className="object-cover rounded"
              />
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold">{collection.name}</div>
              <div className="text-sm md:text-lg font-light">
                <MDXRemote {...(source as any)} components={components} />
              </div>
            </div>

            <div className="flex flex-row space-x-6">
              {collection?.externalUrl ? (
                <Link href={collection.externalUrl}>
                  <a target="_blank" className="text-sm flex flex-row items-center underline">
                    <ExternalLinkIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Website
                  </a>
                </Link>
              ) : null}

              {collection?.twitterUsername ? (
                <Link href={`https://twitter.com/${collection.twitterUsername}`}>
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

              {collection?.discordUrl ? (
                <Link href={collection.discordUrl}>
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

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Total Volume</div>
                  <div className="text-xl md:text-2xl font-semibold">
                    {collection.totalVolume.toLocaleString()} ETH
                  </div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Unique Owners</div>
                  <div className="text-xl md:text-2xl font-semibold">
                    {collection.numOwners.toLocaleString()}
                  </div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Volume (7d)</div>
                  <div className="text-xl md:text-2xl font-semibold">
                    {collection.sevenDayVolume.toLocaleString()} ETH
                  </div>
                </div>
                <div className="bg-dark-800 p-4 rounded">
                  <div className="text-sm md:text-base">Sales (7d)</div>
                  <div className="text-xl md:text-2xl font-semibold">
                    {collection.sevenDaySales.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-row items-center justify-between mt-14 mb-4">
                <div className="text-xl md:text-2xl font-semibold">
                  {collection.totalSupply.toLocaleString()} Total Assets
                </div>
                <button
                  className="block lg:hidden"
                  onClick={() => {
                    setMobileFiltersOpen(true);
                  }}
                >
                  <FilterIcon className="h-6 w-6 font-bold" />
                </button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4 items-center">
                  <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 relative rounded shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="sm:text-sm">
                        <SearchIcon className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <input
                      className="bg-dark-800 rounded pl-10 py-3 pr-10 w-full focus:outline-none"
                      placeholder="Search for an ID"
                      value={search}
                      onInput={e => onInput(e)}
                    />
                    <div
                      className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer"
                      onClick={clearInput}
                    >
                      <span className="sm:text-sm">
                        <XIcon className="h-4 w-4 text-white" />
                      </span>
                    </div>
                  </div>

                  <div className="h-full w-full">
                    <button
                      type="submit"
                      className={`bg-green-960 rounded h-full w-full ${
                        data.loading ? 'opacity-50' : ''
                      }`}
                      disabled={data.loading}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {data.assets.length < 1 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-3xl font-bold">No Assets Found</div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.loading &&
                  Array.from({ length: 25 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="bg-dark-800 h-72 p-4 rounded space-y-4"
                      duration={2}
                      count={1}
                    />
                  ))}

                {!data.loading &&
                  data.assets.map((asset: any, i: number) => (
                    <motion.div
                      whileHover={{ y: '-2%' }}
                      key={i}
                      className="bg-dark-800 p-4 rounded space-y-2 cursor-pointer"
                      onClick={() => {
                        setAsset(asset);
                        setShow(true);
                      }}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center text-sm text-green-940 font-bold">
                          #{asset.defaultRank}
                        </div>
                        <div className="text-sm text-gray-200 font-bold">ID: {asset.tokenId}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        {collection.slug === 'meebits' ? (
                          <img
                            src={asset.imageUrl}
                            style={{
                              height: 160,
                              width: 140,
                            }}
                            className="rounded object-fill"
                          />
                        ) : (
                          <img
                            src={asset.imageUrl}
                            style={{
                              height: 160,
                              width: 160,
                            }}
                            className="rounded object-fill"
                          />
                        )}
                      </div>
                      <div className="text-center space-y-1">
                        <div className="text-sm font-semibold truncate">{asset.name}</div>
                        <div className="bg-green-960 text-green-940 py-1 text-sm font-semibold rounded">
                          Rarity Score: {asset.defaultScore.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {data.page < data.maxPage ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  <button
                    className={`bg-green-960 text-green-940 col-start-3 rounded py-3 ${
                      data.loading ? 'opacity-50' : ''
                    }`}
                    disabled={data.loading}
                    onClick={() => loadMore()}
                  >
                    Load More
                  </button>
                </div>
              ) : null}
            </div>

            <Asset
              isOpen={modal.show}
              setModal={setShow}
              contractAddress={collection.contractAddress ?? ''}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug as string;

  const collection = await getCollection(slug.toLowerCase());
  if (!collection) {
    ctx.res.setHeader('location', 'https://nftrankings.net');
    ctx.res.statusCode = 302;
    ctx.res.end();

    return {
      props: {},
    };
  }

  const attributes = await prisma.attribute.findMany({
    where: { collection: { slug: collection.slug } },
    select: {
      attributeType: true,
      trait: {
        select: {
          traitType: true,
          traitCount: true,
        },
      },
    },
  });

  const source = await renderMarkdown(collection.description);
  const { assets, count } = await getAssets(slug.toLowerCase(), 1);

  return {
    props: {
      collection,
      attributes:
        attributes.map(attribute => ({
          ...attribute,
          trait: attribute.trait.map(trait => ({ ...trait, selected: false })),
        })) ?? [],
      assets,
      source,
      maxPage: Math.ceil(count / 25) ?? 0,
    },
  };
};

export default Slug;
