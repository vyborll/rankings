import { Action, action } from 'easy-peasy';

export interface Attribute {
  attributeType: string;
  trait: {
    selected: boolean;
    traitType: string;
    traitCount: number;
    defaultScore: number;
    percentile: number;
  };
}

export interface IAttribute {
  attributes: Attribute[];
  setAttributes: Action<IAttribute, Attribute[]>;
}

const attributes: IAttribute = {
  attributes: [],
  setAttributes: action((state, payload) => {
    state.attributes = payload;
  }),
};

export default attributes;
