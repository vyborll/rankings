import { objectType, extendType } from 'nexus';
import moment from 'moment-timezone';

export const Upcoming = objectType({
  name: 'Upcoming',
  definition(t) {
    t.string('imageUrl');
    t.string('name');
    t.string('description');
    t.float('price');
    t.nullable.date('releaseDate');
    t.string('currency');
    t.int('supply');
    t.nullable.string('twitterUsername');
    t.nullable.string('discordUrl');
    t.nullable.string('externalUrl');
  },
});

export const UpcomingQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('upcomingFeatured', {
      type: 'Upcoming',
      async resolve(_, __, ctx) {
        return await ctx.prisma.upcoming.findMany({
          where: { featured: true },
          orderBy: {
            releaseDate: 'asc',
          },
        });
      },
    });

    t.list.field('upcoming', {
      type: 'Upcoming',
      async resolve(_, __, ctx) {
        return await ctx.prisma.upcoming.findMany({
          where: {
            featured: false,
            releaseDate: {
              gt: moment().startOf('day').toISOString(),
            },
          },
          orderBy: {
            releaseDate: 'asc',
          },
        });
      },
    });
  },
});
