import prisma from '@root/utils/prisma';
import redis from '@root/utils/redis';
import { renderMarkdown } from '@root/utils/markdown';

const HALF_HOUR = 1800;
const ONE_HOUR = 3600;
const SIX_HOURS = 21600;

export const getCollections = async () => {
  const cached = await redis.get('collections');

  if (!cached) {
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

    await redis.set('collections', JSON.stringify(collections), 'EX', HALF_HOUR);

    return collections;
  }

  return JSON.parse(cached);
};

export const getFeaturedCollections = async () => {
  const cached = await redis.get('collections|featured');

  if (!cached) {
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

    await redis.set('collections|featured', JSON.stringify(featured), 'EX', HALF_HOUR);

    return featured;
  }

  return JSON.parse(cached);
};

export const getLatestCollections = async () => {
  const cached = await redis.get('collections|latest');

  if (!cached) {
    const latest = await prisma.collection.findMany({
      where: { show: true },
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        blockchain: true,
        slug: true,
        imageUrl: true,
        description: true,
        totalSupply: true,
        medias: true,
      },
      take: 9,
    });

    const formatLatest = await Promise.all(
      latest.map(async collection => ({
        ...collection,
        description: await renderMarkdown(collection.description),
      }))
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
        blockchain: true,
        description: true,
        contracts: true,
        medias: true,
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

    await redis.set(`collection|${slug}`, JSON.stringify(collection), 'EX', HALF_HOUR);

    return collection;
  }

  return JSON.parse(cached);
};

// getAssets cached for 6 hours
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
          image: true,
          defaultRank: true,
          defaultScore: true,
          metadata: true,
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
        count: {
          assets: count,
          maxPage: Math.ceil(count / 25),
        },
      };
    }

    await redis.set(`${slug}|assets|${page}`, JSON.stringify(assets), 'EX', SIX_HOURS);
    await redis.set(
      `${slug}|assets|counts`,
      JSON.stringify({ assets: count, maxPage: Math.ceil(count / 25) }),
      'EX',
      SIX_HOURS
    );

    return {
      assets,
      count: {
        assets: count,
        maxPage: Math.ceil(count / 25),
      },
    };
  }

  return {
    assets: JSON.parse(cached),
    count: JSON.parse(cachedCount),
  };
};

// getAttributes cached for 3 hours
export const getAttributes = async (
  slug: string
): Promise<{
  attributes: {
    attributeType: string;
    traits: {
      traitType: string;
      traitCount: number;
      defaultScore: number;
      percentile: number;
    }[];
  }[];
  scores: {
    key: string;
    value: string;
    traitCount: number;
    defaultScore: number;
    percentile: number;
  }[];
}> => {
  const cached = await redis.get(`${slug}|attributes`);
  const cachedScores = await redis.get(`${slug}|scores`);

  if (!cached || !cachedScores) {
    const attributes = await prisma.attribute.findMany({
      where: { collection: { slug } },
      select: {
        attributeType: true,
        traits: {
          select: {
            traitType: true,
            traitCount: true,
            defaultScore: true,
            percentile: true,
          },
        },
      },
    });

    if (!attributes) {
      return {
        attributes: [],
        scores: [],
      };
    }

    const scores: {
      key: string;
      value: string;
      traitCount: number;
      defaultScore: number;
      percentile: number;
    }[] = [];

    await Promise.all(
      attributes.map(async attribute => {
        await Promise.all(
          attribute.traits.map(async trait => {
            scores.push({
              key: attribute.attributeType,
              value: trait.traitType,
              traitCount: trait.traitCount,
              defaultScore: trait.defaultScore,
              percentile: trait.percentile,
            });
          })
        );
      })
    );

    await redis.set(`${slug}|attributes`, JSON.stringify(attributes), 'EX', ONE_HOUR * 3);
    await redis.set(`${slug}|scores`, JSON.stringify(scores), 'EX', ONE_HOUR * 3);

    return {
      attributes,
      scores,
    };
  }

  return {
    attributes: JSON.parse(cached),
    scores: JSON.parse(cachedScores),
  };
};
