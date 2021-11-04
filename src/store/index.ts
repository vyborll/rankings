import { createStore, createTypedHooks } from 'easy-peasy';
import model, { IStoreModel } from './model';

const { useStoreActions, useStoreState, useStoreDispatch } = createTypedHooks<IStoreModel>();

const store = createStore(model);

export { useStoreActions, useStoreState, useStoreDispatch };
export default store;
