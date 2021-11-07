import modal, { IModal } from './modal';
import attributes, { IAttribute } from './attribute';

export interface IStoreModel {
  modal: IModal;
  attributes: IAttribute;
}

const model: IStoreModel = {
  modal,
  attributes,
};

export default model;
