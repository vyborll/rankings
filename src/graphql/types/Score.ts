import { objectType } from "nexus";
import { Asset } from './Asset';

export const Score = objectType({
  name: 'Score',
  definition(t) {
    t.string('type');
    t.int('rarityRank');
    t.float('rarityScore');
    t.field('asset', {
      type: Asset
    })
  }
})