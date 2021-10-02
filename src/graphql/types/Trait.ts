import { objectType } from 'nexus';

export const Trait = objectType({
  name: 'Trait',
  definition(t) {
    t.string('traitType');
    t.string('value');
    t.int('traitCount');
  },
});
