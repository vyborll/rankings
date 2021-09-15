import { objectType, extendType } from 'nexus';

import prisma from '@root/lib/prisma';

export const Upcoming = objectType({
  name: 'Upcoming',
  definition(t) {
    t.string('name');
    t.string('description');
    t.float('price');
    t.int('supply');
    t.nullable.string('twitter_username');
    t.nullable.string('discord_url');
    t.nullable.string('external_url');
  },
});

export const UpcomingQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('upcoming', {
      type: 'Upcoming',
      async resolve() {
        return prisma.upcoming.findMany({
          orderBy: {
            release_date: 'asc',
          },
        });
      },
    });
  },
});
