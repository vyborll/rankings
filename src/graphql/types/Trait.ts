import { objectType } from 'nexus';
import { Attribute } from './Attribute';

export const Trait = objectType({
	name: 'Trait',
	definition(t) {
		t.string('traitType');
		t.int('traitCount');
		t.float('percentile');
		t.float('defaultScore');
		t.nullable.field('attribute', {
			type: Attribute,
		});
	},
});
