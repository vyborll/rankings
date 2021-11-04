import prisma from '@root/utils/lib/prisma';
import redis from '@root/utils/redis';
import { renderMarkdown } from '@root/utils/markdown';

const HALF_HOUR = 1800;
const ONE_HOUR = 3600;
const SIX_HOURS = 21600;

export const getCollections = async () => {
	const cached = await redis.get('collections');
	if (!cached) {
		const collections = await prisma.collection.findMany({
			select: {
				slug: true,
				name: true,
				description: true,
				imageUrl: true,
				discordUrl: true,
				twitterUsername: true,
				instagramUsername: true,
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
				numReports: true,
				marketCap: true,
				floorPrice: true,
			},
			orderBy: {
				totalVolume: 'desc',
			},
		});

		await redis.set('collections', JSON.stringify(collections), 'EX', HALF_HOUR);

		return collections;
	}

	return JSON.parse(cached);
};

export const getFeaturedCollections = async () => {
	const cached = await redis.get('collections|featured');

	if (!cached) {
		const featured = await prisma.featured.findMany({
			where: { active: true },
			orderBy: { slot: 'asc' },
			select: {
				collection: {
					select: {
						slug: true,
						name: true,
						imageUrl: true,
						description: true,
						totalSupply: true,
						externalUrl: true,
						discordUrl: true,
						twitterUsername: true,
					},
				},
			},
		});

		await redis.set('collections|featured', JSON.stringify(featured), 'EX', HALF_HOUR);

		return featured;
	}

	return JSON.parse(cached);
};

export const getLatestCollections = async () => {
	const cached = await redis.get('collections|latest');

	if (!cached) {
		const latest = await prisma.collection.findMany({
			orderBy: { createdAt: 'desc' },
			select: {
				name: true,
				slug: true,
				imageUrl: true,
				description: true,
				totalSupply: true,
				externalUrl: true,
				discordUrl: true,
				twitterUsername: true,
			},
			take: 9,
		});

		const formatLatest = await Promise.all(
			latest.map(async (collection) => ({ ...collection, description: await renderMarkdown(collection.description) })),
		);

		await redis.set('collections|latest', JSON.stringify(formatLatest), 'EX', HALF_HOUR);

		return formatLatest;
	}

	return JSON.parse(cached);
};

export const getCollection = async (slug: string) => {
	const cached = await redis.get(`collection|${slug}`);

	if (!cached) {
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
			return null;
		}

		await redis.set(`collection|${slug}`, JSON.stringify(collection), 'EX', ONE_HOUR);

		return collection;
	}

	return JSON.parse(cached);
};

export const getAssets = async (slug: string, page: number) => {
	const cached = await redis.get(`${slug}|assets|${page}`);
	const cachedCount = await redis.get(`${slug}|assets|counts`);

	if (!cached || !cachedCount) {
		const [assets, count] = await prisma.$transaction([
			prisma.asset.findMany({
				where: {
					slug,
				},
				select: {
					tokenId: true,
					name: true,
					imageUrl: true,
					defaultRank: true,
					defaultScore: true,
					traits: {
						select: {
							attributeType: true,
							traitType: true,
							traitCount: true,
							defaultScore: true,
							percentile: true,
						},
					},
				},
				orderBy: [{ defaultRank: 'asc' }, { tokenId: 'asc' }],
				skip: page * 25 - 25,
				take: 25,
			}),
			prisma.asset.count({
				where: {
					slug,
				},
			}),
		]);

		if (!assets) {
			return {
				assets: [],
				count: 0,
			};
		}

		await redis.set(`${slug}|assets|${page}`, JSON.stringify(assets), 'EX', ONE_HOUR);
		await redis.set(`${slug}|assets|counts`, count, 'EX', ONE_HOUR);

		return {
			assets,
			count,
		};
	}

	return {
		assets: JSON.parse(cached),
		count: parseInt(cachedCount ?? '0'),
	};
};
