import { extendType, objectType, nonNull, stringArg, nullable, booleanArg, intArg } from 'nexus';
import { Rank } from './Rank';
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
			type: Rank,
			args: {
				slug: nonNull(stringArg()),
				tokenId: nonNull(intArg()),
			},
			async resolve(_, args, ctx) {
				return ctx.prisma.rank.findUnique({
					where: {
						rankId: `${args.slug.toLowerCase()}|default|${args.tokenId}`,
					},
					select: {
						defaultRank: true,
						defaultScore: true,
						asset: {
							select: {
								tokenId: true,
								name: true,
								imageUrl: true,
								traits: {
									select: {
										traitType: true,
										traitCount: true,
										percentile: true,
										defaultScore: true,
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
			type: Rank,
			args: {
				slug: nonNull(stringArg()),
				take: nonNull(intArg()),
				page: nonNull(intArg()),
			},
			async resolve(_, args, ctx) {
				if (args.take > 25) {
					throw new Error('The maximum number for take is 25');
				}

				return await ctx.prisma.rank.findMany({
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
						defaultRank: true,
						defaultScore: true,
						asset: {
							select: {
								tokenId: true,
								name: true,
								imageUrl: true,
								traits: {
									select: {
										traitType: true,
										traitCount: true,
										defaultScore: true,
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
					orderBy: { defaultRank: 'asc' },
					skip: args.page * args.take - 25,
					take: args.take ?? 25,
				});
			},
		});
	},
});
