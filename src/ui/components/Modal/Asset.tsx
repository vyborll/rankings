import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';

import { useStoreState, useStoreActions } from '@root/store';

interface Props {
	isOpen: boolean;
	setModal: (open: boolean) => void;
	contractAddress: string;
}

const Asset: React.FC<Props> = ({ isOpen, setModal, contractAddress }) => {
	const sortType = useStoreState((state) => state.modal.sortType);
	const setSortType = useStoreActions((actions) => actions.modal.setSortType);
	const storeAsset = useStoreState((state) => state.modal.asset);

	const cancelButtonRef = useRef(null);

	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setModal(false)}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						<span className="inline-block h-screen align-middle" aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className="inline-block w-full max-w-2xl p-6 my-10 overflow-hidden text-left align-middle transition-all transform bg-dark-900 shadow-xl rounded">
								<Dialog.Title as="h3" className="text-xl text-center font-semibold mb-4">
									{storeAsset?.asset.name}
								</Dialog.Title>

								<div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
									<div className="md:block flex flex-col items-center space-y-4">
										<div className="flex items-center justify-center bg-green-960 text-green-940 rounded px-4 md:px-0 py-1">
											Rank: <span className="font-bold ml-1">#{storeAsset?.defaultRank}</span>
										</div>
										<img style={{ height: 160, width: 160 }} src={storeAsset?.asset.imageUrl} className="rounded" />
										<div>
											<a target="_blank" href={`https://opensea.io/assets/${contractAddress}/${storeAsset?.asset.tokenId}`}>
												<div className="text-sm font-semibold text-center bg-blue-960 py-2 px-4 rounded w-full">View on OpenSea</div>
											</a>
										</div>
									</div>

									<div className="flex flex-1 flex-col space-y-4">
										<div className="flex flex-1 items-center justify-center space-y-4 sm:space-y-0">
											<div className="bg-green-960 text-green-940 rounded px-4 py-1">
												Rarity Score: <span className="font-bold">{storeAsset?.defaultScore.toFixed(2)}</span>
											</div>
										</div>

										<div className="flex flex-row space-x-4">
											<div className="text-sm underline cursor-pointer font-semibold" onClick={() => setSortType('name')}>
												Sort By Name
											</div>
											<div className="text-sm underline cursor-pointer font-semibold" onClick={() => setSortType('score')}>
												Sort By Score
											</div>
										</div>

										<div>
											<div className="space-y-3">
												{sortType === 'score'
													? [...(storeAsset?.asset.traits ?? [])]
															.sort((a, b) => b.defaultScore - a.defaultScore)
															.map((trait, i) => (
																<div key={i} className="flex flex-col space-y-1">
																	<div className="flex flex-row justify-between">
																		<div className="font-semibold">{trait.attribute.attributeType}</div>
																		<div className="text-green-940 font-semibold px-2">+{trait.defaultScore.toFixed(2)}</div>
																	</div>
																	<div className="flex flex-row justify-between items-center bg-dark-800 px-2 py-2 rounded">
																		<div>{trait.traitType}</div>
																		<div className="bg-dark-900 px-4 py-1 rounded w-20 text-center font-bold">{trait.traitCount}</div>
																	</div>
																</div>
															))
													: null}

												{sortType === 'name'
													? [...(storeAsset?.asset.traits ?? [])]
															.sort((a, b) => a.attribute.attributeType.localeCompare(b.attribute.attributeType))
															.map((trait, i) => (
																<div key={i} className="flex flex-col space-y-1">
																	<div className="flex flex-row justify-between">
																		<div className="font-semibold">{trait.attribute.attributeType}</div>
																		<div className="text-green-940 font-semibold px-2">+{trait.defaultScore.toFixed(2)}</div>
																	</div>
																	<div className="flex flex-row justify-between items-center bg-dark-800 px-2 py-2 rounded">
																		<div>{trait.traitType}</div>
																		<div className="bg-dark-900 px-4 py-1 rounded w-20 text-center font-bold">{trait.traitCount}</div>
																	</div>
																</div>
															))
													: null}
											</div>
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default Asset;
