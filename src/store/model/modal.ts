import { Action, action } from 'easy-peasy';

export interface IAsset {
	type: string;
	defaultRank: number;
	defaultScore: number;
	asset: {
		tokenId: string;
		name: string;
		imageUrl: string;
		traits: {
			traitType: string;
			traitCount: number;
			defaultScore: number;
			attribute: {
				attributeType: string;
			};
		}[];
	};
}

export interface IModal {
	show: boolean;
	setShow: Action<IModal, boolean>;
	asset: IAsset | null;
	setAsset: Action<IModal, IAsset>;
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
	sortType: 'score',
	setSortType: action((state, payload) => {
		state.sortType = payload;
		state.asset?.asset.traits.sort((a, b) => b.defaultScore - a.defaultScore);
	}),
};

export default modal;
