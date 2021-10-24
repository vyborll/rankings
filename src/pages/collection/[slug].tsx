import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { ExternalLinkIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { MDXRemote } from 'next-mdx-remote';
import { motion } from 'framer-motion';

import prisma from '@root/utils/lib/prisma';
import { useStoreState, useStoreActions } from '@root/store';

import MarkdownLink from '@root/ui/components/Markdown/Link';
import Asset from '@root/ui/components/Modal/Asset';
import Navbar from '@root/ui/components/Navbar';
import { renderMarkdown } from '@root/utils/markdown';

const components = { ...MarkdownLink };

const getCollectionQuery = gql`
	query Collection($slug: String!, $page: Int!) {
		assets(slug: $slug, take: 25, page: $page) {
			type
			defaultRank
			defaultScore
			asset {
				tokenId
				name
				imageUrl
				traits {
					traitType
					traitCount
					defaultScore
					attribute {
						attributeType
					}
				}
			}
		}
	}
`;

const getAssetQuery = gql`
	query Asset($slug: String!, $tokenId: Int!) {
		asset(slug: $slug, tokenId: $tokenId) {
			type
			defaultRank
			defaultScore
			asset {
				tokenId
				name
				imageUrl
				traits {
					traitType
					traitCount
					defaultScore
					attribute {
						attributeType
					}
				}
			}
		}
	}
`;

const getAssetsQuery = gql`
	query Assets($slug: String!, $page: Int!) {
		assets(slug: $slug, take: 25, page: $page) {
			type
			defaultRank
			defaultScore
			asset {
				tokenId
				name
				imageUrl
				traits {
					traitType
					traitCount
					defaultScore
					attribute {
						attributeType
					}
				}
			}
		}
	}
`;

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

interface Asset {
	type: string;
	defaultRank: number;
	defaultScore: number;
	asset: {
		tokenId: string;
		name: string;
		imageUrl: string;
		traits: {
			traitType: string;
			traitCount: number;
			defaultScore: number;
			attribute: {
				attributeType: string;
			};
		}[];
	};
}

const Slug: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ slug, collection, source }) => {
	const [page, setPage] = useState<number>(1);
	const [assetsLoading, setAssetsLoading] = useState<boolean>(false);
	const [filter, setFilter] = useState<{ type: string; asset: Asset | null }>({ type: 'default', asset: null });
	const [search, setSearch] = useState<string>('');
	const [assets, setAssets] = useState<Asset[]>([]);
	// const [collection, setCollection] = useState<Collection>();
	const modal = useStoreState((state) => state.modal);
	const setShow = useStoreActions((actions) => actions.modal.setShow);
	const setAsset = useStoreActions((actions) => actions.modal.setAsset);
	const client = useApolloClient();

	const { loading } = useQuery(getCollectionQuery, {
		variables: {
			slug,
			page: 1,
		},
		onCompleted: (data) => {
			setAssets([...data.assets]);
		},
	});

	const onSubmit = async (e: React.SyntheticEvent): Promise<void> => {
		e.preventDefault();
		if (!search || search === '') return;
		if (isNaN(Number(search))) return;

		const { data: assetData } = await client.query({
			query: getAssetQuery,
			variables: { slug, tokenId: Number(search) },
		});

		setFilter({ type: 'single', asset: assetData.asset as Asset });
	};

	const onInput = (e: React.FormEvent<HTMLInputElement>): void => {
		setSearch(e.currentTarget.value);
	};

	const clearInput = () => {
		setSearch('');
		setFilter({ type: 'default', asset: null });
	};

	const loadMore = async () => {
		if (assetsLoading) return;
		if (page >= collection!.totalSupply / 25) return;

		setAssetsLoading(true);

		try {
			const { data: assetsData } = await client.query({
				query: getAssetsQuery,
				variables: { slug, page: page + 1 },
			});

			setAssets([...assets, ...assetsData.assets]);
			setPage(page + 1);
		} catch (err) {
			console.error(err);
		} finally {
			setAssetsLoading(false);
		}
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

						<div className="flex flex-row space-x-6 mb-14">
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

						<div className="h-4" />

						<div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<Skeleton className="h-20" duration={2} count={1} />
								<Skeleton className="h-20" duration={2} count={1} />
								<Skeleton className="h-20" duration={2} count={1} />
								<Skeleton className="h-20" duration={2} count={1} />
							</div>
						</div>

						<div className="h-4" />

						<div className="space-y-4">
							<div className="w-60">
								<Skeleton className="h-10" duration={2} count={1} />
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 items-center">
								<div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 relative rounded shadow-sm">
									<Skeleton className="h-10" duration={2} count={1} />
								</div>

								<div className="h-full w-full">
									<Skeleton className="h-10" duration={2} count={1} />
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{Array.from({ length: 25 }).map((_, i) => (
								<div key={i}>
									<Skeleton className="h-60" duration={2} count={1} />
								</div>
							))}
						</div>
					</>
				) : null}

				{!loading && assets && collection ? (
					<>
						<div className="relative w-full h-32 sm:h-40 md:h-60 lg:h-80">
							<Image src={collection.bannerImageUrl ?? ''} layout="fill" className="object-cover rounded" />
						</div>

						<div className="space-y-4">
							<div className="text-3xl font-bold">{collection.name}</div>
							<div className="text-sm md:text-lg font-light">
								<MDXRemote {...source!} components={components} />
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
										<svg className="h-4 w-4 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
									<div className="text-xl md:text-2xl font-semibold">{collection.totalVolume.toLocaleString()} ETH</div>
								</div>
								<div className="bg-dark-800 p-4 rounded">
									<div className="text-sm md:text-base">Unique Owners</div>
									<div className="text-xl md:text-2xl font-semibold">{collection.numOwners.toLocaleString()}</div>
								</div>
								<div className="bg-dark-800 p-4 rounded">
									<div className="text-sm md:text-base">Volume (7d)</div>
									<div className="text-xl md:text-2xl font-semibold">{collection.sevenDayVolume.toLocaleString()} ETH</div>
								</div>
								<div className="bg-dark-800 p-4 rounded">
									<div className="text-sm md:text-base">Sales (7d)</div>
									<div className="text-xl md:text-2xl font-semibold">{collection.sevenDaySales.toLocaleString()}</div>
								</div>
							</div>
						</div>

						<div>
							<div className="text-xl md:text-2xl font-semibold mt-14 mb-4">{collection.totalSupply.toLocaleString()} Total Assets</div>
							<form onSubmit={onSubmit}>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 items-center">
									<div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 relative rounded shadow-sm">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<span className="sm:text-sm">
												<SearchIcon className="h-4 w-4 text-white" />
											</span>
										</div>
										<input
											className="bg-dark-800 rounded pl-10 py-3 pr-10 w-full focus:outline-none"
											placeholder="Search for an ID"
											value={search}
											onInput={(e) => onInput(e)}
										/>
										<div className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer" onClick={clearInput}>
											<span className="sm:text-sm">
												<XIcon className="h-4 w-4 text-white" />
											</span>
										</div>
									</div>

									<div className="h-full w-full">
										<button
											type="submit"
											className={`bg-green-960 rounded h-full w-full ${assetsLoading ? 'opacity-50' : ''}`}
											disabled={assetsLoading}
										>
											Search
										</button>
									</div>
								</div>
							</form>

							{assets.length < 1 ? (
								<div className="h-64 flex items-center justify-center">
									<div className="text-3xl font-bold">No Assets Found</div>
								</div>
							) : null}

							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{filter.type === 'default' &&
									assets.map((asset: any, i: number) => (
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
												<div className="flex flex-row items-center text-sm text-green-940 font-bold">#{asset.defaultRank}</div>
												<div className="text-sm text-gray-200 font-bold">ID: {asset.asset.tokenId}</div>
											</div>
											<div className="flex items-center justify-center">
												<img
													src={asset.asset.imageUrl}
													style={{
														height: 160,
														width: 160,
													}}
													className="rounded object-fill"
												/>
											</div>
											<div className="text-center space-y-1">
												<div className="text-sm font-semibold truncate">{asset.asset.name}</div>
												<div className="bg-green-960 text-green-940 py-1 text-sm font-semibold rounded">
													Rarity Score: {asset.defaultScore.toFixed(2)}
												</div>
											</div>
										</motion.div>
									))}

								{filter.type === 'single' && filter.asset ? (
									<motion.div
										whileHover={{ y: '-2%' }}
										className="bg-dark-800 p-4 rounded space-y-2 cursor-pointer"
										onClick={() => {
											setAsset(filter.asset!);
											setShow(true);
										}}
									>
										<div className="flex flex-row items-center justify-between">
											<div className="flex flex-row items-center text-sm text-green-940 font-bold">#{filter.asset.defaultRank}</div>
											<div className="text-sm text-gray-200 font-bold">ID: {filter.asset.asset.tokenId}</div>
										</div>
										<div className="flex items-center justify-center">
											<img
												src={filter.asset.asset.imageUrl}
												style={{
													height: 140,
													width: 140,
												}}
												className="rounded"
											/>
										</div>
										<div className="text-center space-y-1">
											<div className="text-sm font-semibold truncate">{filter.asset.asset.name}</div>
											<div className="bg-green-960 text-green-940 py-1 text-sm font-semibold rounded">
												Rarity Score: {filter.asset.defaultScore.toFixed(2)}
											</div>
										</div>
									</motion.div>
								) : null}
							</div>

							{page < Math.ceil(collection.totalSupply / 25) ? (
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
									<button
										className={`bg-green-960 text-green-940 col-start-3 rounded py-3 ${assetsLoading ? 'opacity-50' : ''}`}
										disabled={assetsLoading}
										onClick={() => loadMore()}
									>
										Load More
									</button>
								</div>
							) : null}
						</div>

						<Asset isOpen={modal.show} setModal={setShow} contractAddress={collection.contractAddress ?? ''} />
					</>
				) : null}
			</div>
		</>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const slug = ctx.params?.slug as string;

	const collection = await prisma.collection.findUnique({
		where: { slug },
		select: {
			name: true,
			description: true,
			contractAddress: true,
			externalUrl: true,
			discordUrl: true,
			twitterUsername: true,
			slug: true,
			bannerImageUrl: true,
			totalVolume: true,
			totalSupply: true,
			sevenDayVolume: true,
			sevenDaySales: true,
			numOwners: true,
		},
	});

	if (!collection) {
		ctx.res.setHeader('location', 'https://nftranks.gg');
		ctx.res.statusCode = 302;
		ctx.res.end();

		return {
			props: {},
		};
	}

	const source = await renderMarkdown(collection?.description ?? '');

	return {
		props: {
			slug,
			collection,
			source,
		},
	};
};

export default Slug;
