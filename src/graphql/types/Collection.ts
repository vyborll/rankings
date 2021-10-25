import { objectType, extendType, nonNull, stringArg, nullable, booleanArg } from 'nexus';

export const Collection = objectType({
  name: 'Collection',
  definition(t) {
    t.string('slug');
    t.string('name');
    t.string('description');
    t.nullable.string('contractAddress');
    t.nullable.string('bannerImageUrl');
    t.nullable.string('imageUrl');
    t.nullable.string('largeImageUrl');
    t.nullable.string('discordUrl');
    t.nullable.string('externalUrl');
    t.nullable.string('twitterUsername');
    t.nullable.string('instagramUsername');
    t.float('oneDayVolume');
    t.float('oneDayChange');
    t.int('oneDaySales');
    t.float('oneDayAveragePrice');
    t.float('sevenDayVolume');
    t.float('sevenDayChange');
    t.int('sevenDaySales');
    t.float('sevenDayAveragePrice');
    t.float('thirtyDayVolume');
    t.float('thirtyDayChange');
    t.int('thirtyDaySales');
    t.float('thirtyDayAveragePrice');
    t.float('totalVolume');
    t.int('totalSales');
    t.int('totalSupply');
    t.int('numOwners');
    t.float('averagePrice');
    t.int('numReports');
    t.float('marketCap');
    t.float('floorPrice');
  },
});

export const CollectionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('collection', {
      type: 'Collection',
      args: {
        slug: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return ctx.prisma.collection.findUnique({
          where: { slug: args.slug.toLowerCase() },
        });
      },
    });

    t.list.field('collections', {
      type: 'Collection',
      args: {
        orderBy: nullable(stringArg()),
        sortAscending: nullable(stringArg()),
      },
      async resolve(_, args, ctx) {
        return ctx.prisma.collection.findMany({
          orderBy: {
            totalVolume: 'desc',
          },
        });
      },
    });

    t.list.field('collectionsLatest', {
      type: 'Collection',
      async resolve(_, __, ctx) {
        return ctx.prisma.collection.findMany({
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
          take: 9,
        });
      },
    });
  },
});
