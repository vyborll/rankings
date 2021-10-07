import { objectType } from "nexus";

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.string('attributeType');
  }
});