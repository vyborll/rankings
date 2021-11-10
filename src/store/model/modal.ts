import { Action, action } from 'easy-peasy';

export interface IAsset {
  tokenId: string;
  name: string;
  image: string;
  defaultRank: number;
  defaultScore: number;
  metadata: { [key: string]: string }[];
}

export interface IScore {
  attributeType: string;
  traits: {
    traitType: string;
    traitCount: number;
    defaultScore: number;
    percentile: number;
  }[];
}

export interface IModal {
  show: boolean;
  setShow: Action<IModal, boolean>;
  asset: IAsset | null;
  setAsset: Action<IModal, IAsset>;
  scores: IScore[];
  setScores: Action<IModal, IScore[]>;
  sortType: string;
  setSortType: Action<IModal, string>;
}

const modal: IModal = {
  show: false,
  setShow: action((state, payload) => {
    state.show = payload;
  }),
  asset: null,
  setAsset: action((state, payload) => {
    state.asset = payload;
  }),
  scores: [],
  setScores: action((state, payload) => {
    state.scores = payload;
  }),
  sortType: 'score',
  setSortType: action((state, payload) => {
    state.sortType = payload;
    // state.asset?.traits.sort((a, b) => b.defaultScore - a.defaultScore);
  }),
};

export default modal;
