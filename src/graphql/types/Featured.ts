import { extendType, objectType } from 'nexus';
import { Collection } from './Collection';

export const Featured = objectType({
	name: 'Featured',
	definition(t) {
		t.int('slot');
		t.nullable.field('collection', {
			type: Collection,
		});
	},
});

export const FeaturedQuery = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('featured', {
			type: Featured,
			args: {},
			async resolve(_, __, ctx) {
				return ctx.prisma.featured.findMany({
					orderBy: {
						slot: 'asc',
					},
					include: {
						collection: true,
					},
				});
			},
		});
	},
});
