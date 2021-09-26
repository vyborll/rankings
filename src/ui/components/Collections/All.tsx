import type { ApolloError } from '@apollo/client';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

interface Props {
	loading: boolean;
	error: ApolloError | undefined;
	collections: {
		name: string;
		slug: string;
		imageUrl: string;
		sevenDayVolume: number;
		sevenDaySales: number;
		totalVolume: number;
		totalSales: number;
		totalSupply: number;
		numOwners: number;
	}[];
}

const AllCollections: React.FC<Props> = ({ loading, collections }) => {
	return (
		<>
			<div className="mt-20">
				<span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">All Collections</span>
			</div>

			<div className="flex flex-col">
				<div className="-my-2">
					<div className="py-2 min-w-full">
						<div className="shadow overflow-hidden border-b border-divider-900 rounded overflow-x-auto no-scrollbar">
							<table className="min-w-full divide-y divide-divider-900">
								<thead className="bg-dark-800">
									<tr>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											#
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Name
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Volume (All Time)
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Sales (All Time)
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Volume (7d)
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Sales (7d)
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Supply
										</th>
										<th scope="col" className="px-6 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
											Owners
										</th>
									</tr>
								</thead>
								<tbody className="bg-dark-800 divide-y divide-divider-900">
									{loading &&
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
										))}

									{!loading &&
										collections &&
										collections.map((collection, i) => (
											<tr key={i}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-xs">{i + 1}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<Link href={`/collection/${collection.slug}`}>
														<a className="flex items-center">
															<div className="flex items-center flex-shrink-0 h-10 w-10">
																<img className="h-8 w-8 md:h-10 md:w-10 rounded-full" src={collection.imageUrl} alt={collection.name} />
															</div>
															<div className="ml-2 md:ml-4">
																<div className="text-green-950 font-bold text-base md:text-lg hover:underline cursor-pointer">{collection.name}</div>
															</div>
														</a>
													</Link>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-xs md:text-sm font-medium tracking-wider">
														{collection.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETH
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap tracking-wider">
													<div className="text-xs md:text-sm font-medium">{collection.totalSales.toLocaleString()}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap tracking-wider">
													<div className="text-xs md:text-sm font-medium">{collection.sevenDayVolume.toLocaleString()} ETH</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap tracking-wider">
													<div className="text-xs md:text-sm font-medium">{collection.sevenDaySales.toLocaleString()}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap tracking-wider">
													<div className="text-xs md:text-sm font-medium">{collection.totalSupply.toLocaleString()}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap tracking-wider">
													<div className="text-xs md:text-sm font-medium">{collection.numOwners.toLocaleString()}</div>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AllCollections;
