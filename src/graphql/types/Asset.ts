import { extendType, objectType, nonNull, stringArg, nullable, booleanArg, intArg } from 'nexus';
import { Score } from './Score';
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
		t.nullable.field('asset', {
			type: Score,
			args: {
				slug: nonNull(stringArg()),
				tokenId: nonNull(intArg()),
			},
			async resolve(_, args, ctx) {
				return ctx.prisma.score.findUnique({
					where: {
						scoreId: `${args.slug.toLowerCase()}_${args.tokenId}_default`,
					},
					select: {
						rarityRank: true,
						rarityScore: true,
						asset: {
							select: {
								tokenId: true,
								name: true,
								imageUrl: true,
								traits: {
									select: {
										traitType: true,
										traitCount: true,
										rarityScore: true,
										percentile: true,
										attribute: {
											select: {
												attributeType: true,
											},
										},
									},
								},
							},
						},
					},
				});
			},
		});

		t.list.field('assets', {
			type: Score,
			args: {
				slug: nonNull(stringArg()),
				take: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			async resolve(_, args, ctx) {
				if (args.take > 25) {
					throw new Error('The maximum number for take is 25');
				}

				return ctx.prisma.score.findMany({
					where: {
						type: 'default',
						asset: {
							collection: {
								slug: {
									equals: args.slug,
								},
							},
						},
					},
					select: {
						rarityRank: true,
						rarityScore: true,
						asset: {
							select: {
								tokenId: true,
								name: true,
								imageUrl: true,
								traits: {
									select: {
										traitType: true,
										traitCount: true,
										rarityScore: true,
										percentile: true,
										attribute: {
											select: {
												attributeType: true,
											},
										},
									},
								},
							},
						},
					},
					skip: args.page * args.take - 25,
					take: args.take ?? 25,
				});
			},
		});
	},
});
