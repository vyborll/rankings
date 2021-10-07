import modal, { IModal } from './modal';

export interface IStoreModel {
  modal: IModal
}

const model: IStoreModel = {
  modal
};


export default model;
