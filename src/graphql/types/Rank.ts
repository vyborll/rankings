import { objectType } from 'nexus';
import { Asset } from './Asset';

export const Rank = objectType({
	name: 'Rank',
	definition(t) {
		t.string('tokenId');
		t.string('type');
		t.float('defaultScore');
		t.int('defaultRank');
		t.field('asset', {
			type: Asset,
		});
	},
});
