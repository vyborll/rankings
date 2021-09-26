import type { Prisma } from '@prisma/client';
import puppeteer from 'puppeteer';

import prisma from '@root/utils/lib/prisma';

class OpenSea {
	API_INTERVAL: number;
	COLLECTION_BROWSER: puppeteer.Browser | null;
	COLLECTION_PAGE: puppeteer.Page | null;
	ASSETS_BROWSER: puppeteer.Browser | null;
	ASSETS_PAGE: puppeteer.Page | null;

	constructor() {
		this.API_INTERVAL = 2500;
		this.COLLECTION_BROWSER = null;
		this.COLLECTION_PAGE = null;
		this.ASSETS_BROWSER = null;
		this.ASSETS_PAGE = null;
	}

	async test() {
		this.ASSETS_BROWSER = await puppeteer.launch({ headless: false });
		this.ASSETS_PAGE = await this.ASSETS_BROWSER.newPage();

		await this.ASSETS_PAGE.setExtraHTTPHeaders({
			'content-type': 'application/graphql',
		});

		await this.ASSETS_PAGE.goto(
			'https://api.opensea.io/graphql/?query=%7Bquery%20%7B%20search(collections:%20[%22cryptopunks%22],%20first:%20100,%20sortBy:%20CREATED_DATE,%20after:%20%22%22)%20%7B%20pageInfo%20%7B%20hasNextPage%20hasPreviousPage%20startCursor%20endCursor%20%7D%20edges%20%7B%20node%20%7B%20asset%20%7B%20tokenId%20name%20imageUrl%20traits(first:%20100)%20%7B%20edges%20%7B%20node%20%7B%20traitCount%20traitType%20value%20floatValue%20dateValue%20displayType%20maxValue%20id%20intValue%20createdDate%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%7D',
		);
	}

	async getAllAssets(slug: string, supply: number) {
		if (!slug) throw new Error('Invalid Slug');
		if (!supply) throw new Error('Invalid Supply');

		if (!this.ASSETS_BROWSER && !this.ASSETS_PAGE) {
			this.ASSETS_BROWSER = await puppeteer.launch({ headless: false });
		}

		const pages: number = Math.ceil(supply / 100);
		let page: number = 1;
		let cursor: string | null = null;

		const collection = await prisma.collection.findUnique({
			where: { slug },
			select: {
				id: true,
				slug: true,
				Trait: {
					select: {
						id: true,
						traitType: true,
						traitCount: true,
						value: true,
					},
				},
			},
		});

		if (!collection) throw new Error('No collection found with that slug');

		const transactions: any[] = [];

		while (page <= pages) {
			const query: string = await this.searchAssetsQuery(slug, cursor);
			const response: { success: boolean; data: any } = await this.sendGqlRequest(this.ASSETS_BROWSER, query, 10250);

			if (response.success) {
				cursor = response.data.data.query.search.pageInfo.hasNextPage === true ? response.data.data.query.search.pageInfo.endCursor : null;

				console.log(`Page: ${page}`);

				await Promise.all(
					response.data.data.query.search.edges.map(async (a: any) => {
						if (a.node.asset !== null) {
							transactions.push(
								prisma.asset.upsert({
									where: { assetSlug: `${collection.slug}:${a.node.asset.tokenId}` },
									update: {},
									create: {
										assetSlug: `${collection.slug}:${a.node.asset.tokenId}`,
										tokenId: a.node.asset.tokenId,
										name: a.node.asset.name,
										imageUrl: a.node.asset.imageUrl,
										collectionId: collection.id,
										traitIDs: a.node.asset.traits.edges.map((t: any) => {
											let found = collection.Trait.find((ct) => ct.traitType === t.node.traitType && ct.value === t.node.value);
											return found ? found.id : '';
										}),
									},
								}),
							);
						}
					}),
				);

				page += 1;
			}
		}

		await this.closeAssets();

		const chunks = this.chunkArray(transactions, 250);
		for (const chunk of chunks) {
			console.log(chunk.length);
			await prisma.$transaction(chunk);
		}
	}

	async getAllCollections() {
		if (!this.COLLECTION_BROWSER && !this.COLLECTION_PAGE) {
			this.COLLECTION_BROWSER = await puppeteer.launch({ headless: false });
			this.COLLECTION_PAGE = await this.COLLECTION_BROWSER.newPage();
			this.COLLECTION_PAGE.setRequestInterception(true);
		}

		const collections = await prisma.collections.findUnique({ where: { type: 'collections' } });
		if (!collections) {
			await this.closeCollection();
			return;
		}

		const query = await this.getCollectionsQuery(collections?.slugs ?? []);
		const response = await this.sendGqlRequest(this.COLLECTION_BROWSER, query);

		if (response.success) {
			const transactions: any[] = [];

			await Promise.all(
				response.data.data.query.collections.edges.map(async (c: any) => {
					const collection = await prisma.collection.findUnique({ where: { slug: c.node.slug } });

					await Promise.all(
						c.node.stringTraits.map(async (st: any) => {
							await Promise.all(
								st.counts.map(async (t: { value: string; count: number }) => {
									if (collection) {
										transactions.push(
											prisma.trait.upsert({
												where: { slug: `${c.node.slug}:${st.key}:${t.value}` },
												update: {
													traitCount: t.count,
												},
												create: {
													slug: `${c.node.slug}:${st.key}:${t.value}`,
													traitType: st.key,
													traitCount: t.count,
													value: t.value,
													collectionId: collection.id,
												},
											}),
										);
									}
								}),
							);
						}),
					);

					const data = {
						slug: c.node.slug,
						contractAddress: c.node.assetContracts.edges[0].node.address ?? '',
						name: c.node.name,
						description: c.node.description,
						bannerImageUrl: c.node.bannerImageUrl,
						imageUrl: c.node.imageUrl,
						largeImageUrl: c.node.largeImageUrl,
						discordUrl: c.node.discordUrl,
						externalUrl: c.node.externalUrl,
						twitterUsername: c.node.twitterUsername,
						instagramUsername: c.node.instagramUsername,
						oneDayVolume: c.node.stats.oneDayVolume,
						oneDayChange: c.node.stats.oneDayChange,
						oneDaySales: c.node.stats.oneDaySales,
						oneDayAveragePrice: c.node.stats.oneDayAveragePrice,
						sevenDayVolume: c.node.stats.sevenDayVolume,
						sevenDayChange: c.node.stats.sevenDayChange,
						sevenDaySales: c.node.stats.sevenDaySales,
						sevenDayAveragePrice: c.node.stats.sevenDayAveragePrice,
						thirtyDayVolume: c.node.stats.thirtyDayVolume,
						thirtyDayChange: c.node.stats.thirtyDayChange,
						thirtyDaySales: c.node.stats.thirtyDaySales,
						thirtyDayAveragePrice: c.node.stats.thirtyDayAveragePrice,
						totalVolume: c.node.stats.totalVolume,
						totalSales: c.node.stats.totalSales,
						totalSupply: c.node.stats.totalSupply,
						numOwners: c.node.stats.numOwners,
						averagePrice: c.node.stats.averagePrice,
						numReports: c.node.stats.numReports,
						marketCap: c.node.stats.marketCap,
						floorPrice: c.node.stats.floorPrice,
					};

					await prisma.collection.upsert({
						where: { slug: c.node.slug },
						update: data,
						create: data,
					});
				}),
			);

			await this.closeCollection();

			const chunks = this.chunkArray(transactions, 250);
			for (const chunk of chunks) {
				await prisma.$transaction(chunk);
			}
		}
	}

	chunkArray(transactions: any[], chunkSize: number) {
		return Array.from({ length: Math.ceil(transactions.length / chunkSize) }, (_, i) => transactions.slice(i * chunkSize, (i + 1) * chunkSize));
	}

	async sendGqlRequest(browser: puppeteer.Browser | null, query: string, timeout?: number): Promise<{ success: boolean; data: any }> {
		return new Promise<{ success: boolean; data: any }>(async (resolve) => {
			const page = await browser?.newPage();
			await page?.setRequestInterception(true);

			setTimeout(async () => {
				page?.on('request', async (interceptedRequest) => {
					const postData = query;
					interceptedRequest.continue({ method: 'GET', postData, headers: { 'content-type': 'application/graphql' } });
				});

				const response = await page?.goto('https://api.opensea.io/graphql');
				if (response?.status() === 200) {
					resolve({ success: true, data: JSON.parse(await response.text()) });
				} else {
					resolve({ success: false, data: null });
				}

				await page?.close();
			}, timeout ?? 100);
		});
	}

	async searchAssetsQuery(slug: string, cursor: string | null): Promise<string> {
		return `{query { search(collections: ["${slug}"], first: 100, sortBy: CREATED_DATE, after: "${cursor ?? ''}") {
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
			edges {
				node {
					asset {
						tokenId
						name
						imageUrl
						traits(first: 100) {
							edges {
								node {
									traitCount
									traitType
									value
									floatValue
									dateValue
									displayType
									maxValue
									id
									intValue
									createdDate
								}
							}
						}
					}
				}
			}
		} }}`;
	}

	async getCollectionsQuery(slugs: string[]): Promise<string> {
		return `{query { collections(collections: [${slugs.map((s) => `"${s}"`)}], first: ${
			slugs.length
		}, sortBy: TOTAL_VOLUME) { pageInfo { startCursor endCursor } edges { node { slug name description bannerImageUrl imageUrl largeImageUrl discordUrl externalUrl twitterUsername instagramUsername assetContracts(first: 1) { edges { node { address } } } stringTraits { key counts { value count } } stats { oneDayVolume oneDayChange oneDaySales oneDayAveragePrice sevenDayVolume sevenDayChange sevenDaySales sevenDayAveragePrice thirtyDayVolume thirtyDayChange thirtyDaySales thirtyDayAveragePrice totalVolume totalSales totalSupply numOwners averagePrice numReports marketCap floorPrice } } } } }}`;
	}

	async closeCollection(): Promise<boolean> {
		await this.COLLECTION_BROWSER?.close();
		this.COLLECTION_BROWSER = null;
		this.COLLECTION_PAGE = null;
		return true;
	}

	async closeAssets(): Promise<boolean> {
		await this.ASSETS_BROWSER?.close();
		this.ASSETS_BROWSER = null;
		this.ASSETS_PAGE = null;
		return true;
	}
}

const api = new OpenSea();
export default api;
