import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

interface Props {
	isOpen: boolean;
	setModal: (open: boolean) => void;
	asset: {
		id: number;
		rank: number;
		name: string;
		img: string;
	} | null;
}

const traits = [
	{
		type: 'Attribute Count',
		trait: '7',
		score: 10000,
	},
	{
		type: 'Blemishes',
		trait: 'Mole',
		score: 15.53,
	},
	{
		type: 'Ears',
		trait: 'Earring',
		score: 4.07,
	},
	{
		type: 'Eyes',
		trait: 'Classic Shades',
		score: 19.92,
	},
	{
		type: 'Facial Hair',
		trait: 'Big Beard',
		score: 68.49,
	},
	{
		type: 'Full Type',
		trait: 'Male-Mid',
		score: 5.39,
	},
	{
		type: 'Hair',
		trait: 'Top Hat',
		score: 86.96,
	},
	{
		type: 'Mouth',
		trait: 'Buck Teeth',
		score: 128.21,
	},
	{
		type: 'Mouth Prop',
		trait: 'Cigarette',
		score: 10.41,
	},
	{
		type: 'Neck Accessory',
		trait: 'None',
		score: 1.04,
	},
	{
		type: 'Nose',
		trait: 'None',
		score: 1.02,
	},
	{
		type: 'Punk Type',
		trait: 'Male',
		score: 1.66,
	},
];

const Asset: React.FC<Props> = ({ isOpen, setModal, asset }) => {
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
							<div className="inline-block w-full max-w-3xl p-6 my-10 overflow-hidden text-left align-middle transition-all transform bg-dark-900 shadow-xl rounded">
								<Dialog.Title as="h3" className="text-xl text-center font-semibold mb-4">
									{asset?.name}
								</Dialog.Title>

								{/* LG */}
								<div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4">
									<div className="md:block flex flex-col items-center space-y-4">
										<img style={{ height: 160, width: 160 }} src={asset?.img} className="rounded" />
										<div className="text-sm font-semibold text-center bg-blue-960 py-2 px-4 rounded w-full">View on OpenSea</div>
									</div>

									<div className="flex flex-1 flex-col space-y-4">
										<div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
											<div className="flex items-center bg-green-960 text-green-940 rounded px-4 py-1">
												<FontAwesomeIcon icon={faTrophy} className="hidden xs:block h-3 w-3 mr-2" />
												Rarity Rank: <span className="font-bold ml-1">#1</span>
											</div>
											<div className="bg-green-960 text-green-940 rounded px-4 py-1">
												Rarity Score: <span className="font-bold">215.23</span>
											</div>
										</div>

										<div className="">
											{/* {traits.map((trait, i) => (
												<div className="flex flex-row space-x-4 items-center">
													<div className="text-gray-300 w-40">{trait.type}</div>
													<div className="w-40">{trait.trait}</div>
													<div className="text-sm text-green-940">+{trait.score}</div>
												</div>
											))} */}

											<div className="flex flex-col">
												<div className="-my-2">
													<div className="py-2 min-w-full">
														<div className="shadow overflow-hidden border-b border-divider-900 rounded overflow-x-auto no-scrollbar">
															<table className="min-w-full divide-y divide-divider-900">
																<thead className="bg-dark-800">
																	<tr>
																		<th
																			scope="col"
																			className="px-6 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
																		>
																			Type
																		</th>
																		<th
																			scope="col"
																			className="px-6 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
																		>
																			Trait
																		</th>
																		<th
																			scope="col"
																			className="px-6 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
																		>
																			Score
																		</th>
																	</tr>
																</thead>
																<tbody className="bg-dark-800 divide-y divide-divider-900">
																	{/* {loading &&
																		Array.from({ length: 10 }).map((_, i) => (
																			<tr key={i}>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<Skeleton duration={2} count={1} />
																				</td>
																			</tr>
																		))} */}

																	{traits &&
																		traits.map((trait, i) => (
																			<tr key={i}>
																				<td className="px-6 py-4 whitespace-nowrap">
																					{/* <Link href={`/collection/${collection.slug}`}>
																						<a className="flex items-center">
																							<div className="flex items-center flex-shrink-0 h-10 w-10">
																								<img
																									className="h-8 w-8 md:h-10 md:w-10 rounded-full"
																									src={collection.image_url}
																									alt={collection.name}
																								/>
																							</div>
																							<div className="ml-2 md:ml-4">
																								<div className="text-green-950 font-bold text-base md:text-lg hover:underline cursor-pointer">
																									{collection.name}
																								</div>
																							</div>
																						</a>
																					</Link> */}
																					<div>{trait.type}</div>
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap">
																					<div className="text-xs md:text-sm font-medium tracking-wider">{trait.trait}</div>
																				</td>
																				<td className="px-6 py-4 whitespace-nowrap tracking-wider">
																					<div className="text-xs md:text-sm font-medium text-green-940">+{trait.score}</div>
																				</td>
																			</tr>
																		))}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>

			{/* <Transition.Root show={isOpen} as={Fragment}>
				<Dialog as="div" className="fixed z-20 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => setModal(false)}>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

						<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<div className="inline-block align-bottom bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
								<div className="flex flex-row bg-dark-900 px-4 pt-4 pb-4 sm:p-6 sm:pb-6">
									<div className="sm:flex">
										<div className="flex flex-row">
											<div className="space-y-2">
												<p className="text-base font-semibold truncate">{asset?.name}</p>
												<img style={{ height: 160, width: 160 }} src={asset?.img} alt={asset?.name} className="rounded" />
												<div>
													<div className="text-sm font-semibold text-center bg-blue-960 py-2 px-4 rounded">View on OpenSea</div>
												</div>
											</div>
										</div>

										<div className="flex flex-col px-4">
											<div>
												<div className="bg-green-960 text-green-940 rounded px-4 py-1">
													Rarity Score: <span className="font-bold">25.38</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root> */}
		</>
	);
};

export default Asset;
