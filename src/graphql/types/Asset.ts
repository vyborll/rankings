import { extendType, objectType, nonNull, stringArg, nullable, booleanArg } from 'nexus';
import { Trait } from './Trait';

export const Asset = objectType({
  name: 'Asset',
  definition(t) {
    t.string('tokenId');
    t.string('name');
    t.string('imageUrl');
    t.nullable.list.field('traits', {
      type: Trait,
    });
  },
});

export const AssetQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('assets', {
      type: 'Asset',
      args: {
        slug: nonNull(stringArg()),
        traits: nullable(booleanArg()),
      },
      async resolve(_, args, ctx) {
        return ctx.prisma.asset.findMany({
          where: {
            tokenId: '2116',
            collection: {
              slug: {
                equals: args.slug,
              },
            },
          },
          include: {
            traits: !!args.traits,
          },
          take: 50,
        });
      },
    });
  },
});
