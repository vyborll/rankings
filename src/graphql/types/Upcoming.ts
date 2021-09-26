import { objectType, extendType } from 'nexus';

export const Upcoming = objectType({
	name: 'Upcoming',
	definition(t) {
		t.string('name');
		t.string('description');
		t.float('price');
		t.int('supply');
		t.nullable.string('twitterUsername');
		t.nullable.string('discordUrl');
		t.nullable.string('externalUrl');
	},
});

export const UpcomingQuery = extendType({
	type: 'Query',
	definition(t) {
		t.list.field('upcoming', {
			type: 'Upcoming',
			async resolve(_, __, ctx) {
				return ctx.prisma.upcoming.findMany({
					orderBy: {
						releaseDate: 'asc',
					},
				});
			},
		});
	},
});
