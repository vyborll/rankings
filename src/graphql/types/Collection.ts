import { objectType, extendType } from 'nexus';

import prisma from '@root/lib/prisma';

export const Collection = objectType({
  name: 'Collection',
  definition(t) {
    t.string('slug');
    t.string('name');
    t.string('description');
    t.nullable.string('banner_image_url');
    t.nullable.string('image_url');
    t.nullable.string('large_image_url');
    t.nullable.string('discord_url');
    t.nullable.string('external_url');
    t.nullable.string('twitter_username');
    t.nullable.string('instagram_username');
    t.float('one_day_volume');
    t.float('one_day_change');
    t.int('one_day_sales');
    t.float('one_day_average_price');
    t.float('seven_day_volume');
    t.float('seven_day_change');
    t.int('seven_day_sales');
    t.float('seven_day_average_price');
    t.float('thirty_day_volume');
    t.float('thirty_day_change');
    t.int('thirty_day_sales');
    t.float('thirty_day_average_price');
    t.float('total_volume');
    t.int('total_sales');
    t.int('total_supply');
    t.int('num_owners');
    t.float('average_price');
    t.int('num_reports');
    t.float('market_cap');
    t.float('floor_price');
  },
});

export const CollectionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('collections', {
      type: 'Collection',
      async resolve() {
        return prisma.collection.findMany({
          orderBy: {
            total_volume: 'desc',
          },
        });
      },
    });
  },
});
