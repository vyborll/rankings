import type { InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import moment from 'moment-timezone';
import { motion } from 'framer-motion';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';

moment.tz.add(
	'America/New_York|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6',
);

const Upcoming: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ featured, upcoming }) => {
	return (
		<>
			<Navbar />

			<Layout>
				<div className="space-y-6">
					<div className="text-center">
						<span className="text-3xl font-bold mb-1 border-b border-green-950 pb-1">Upcoming NFT Drops</span>
					</div>

					<div className="max-w-3xl mx-auto text-center space-y-2">
						<div>
							You can submit your upcoming NFT project to be listed on the &quot;Upcoming NFT Drops&quot; page for free. Just fill out the form below
							with all the required information for it to be listed.
						</div>
						<div>
							<Link href={'/drops/submit'}>
								<a className="underline font-semibold text-lg">Submit a project</a>
							</Link>
						</div>
					</div>
				</div>

				{upcoming.length < 1 && featured.length < 1 ? (
					<div className="flex items-center justify-center h-96">
						<div className="text-3xl font-bold">No Upcoming Drops Found</div>
					</div>
				) : null}

				{featured.map((drop, i: number) => (
					<motion.div whileHover={{ scale: 1.02 }} key={i} className="relative bg-dark-800 p-4 rounded overflow-hidden border border-green-950">
						<div className="ribbon bg-green-950 text-base font-bold whitespace-no-wrap px-10 py-1">Featured</div>

						<div className="flex flex-row md:space-x-4">
							<div>
								<img src={drop.imageUrl} className="hidden md:block h-full w-44 rounded" />
							</div>

							<div className="flex flex-col flex-1 space-y-4">
								<div className="md:hidden flex flex-row items-center space-x-4">
									<img src={drop.imageUrl} className="h-full w-24 rounded" />
									<div className="flex flex-col">
										<div className="text-lg sm:text-2xl font-bold">{drop.name}</div>
										<div className="text-sm line-clamp-2">{drop.description}</div>
									</div>
								</div>

								<div className="hidden md:flex md:flex-col">
									<div className="text-2xl font-bold">{drop.name}</div>
									<div className="text-base h-12 line-clamp-2">{drop.description}</div>
								</div>

								<div className="flex flex-row items-center space-x-4">
									{drop.externalUrl ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<ExternalLinkIcon className="h-5 w-5 mr-1" />
											Website
										</div>
									) : null}
									{drop.twitterUsername ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<svg className="h-4 w-4 fill-current text-gray-300 mr-1" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<title>Twitter</title>
												<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
											</svg>
											@{drop.twitterUsername}
										</div>
									) : null}
									{drop.discordUrl ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<svg className="h-4 w-4 fill-current text-gray-300 mr-2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<title>Discord</title>
												<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
											</svg>
											Discord
										</div>
									) : null}
								</div>

								<div className="flex flex-col space-y-2 lg:flex-row lg:justify-between lg:items-end lg:space-x-2">
									<div className="flex flex-row items-center space-x-2">
										<div className="text-sm sm:text-sm lg:text-base bg-dark-900 px-4  py-1 rounded-full">{drop.supply.toLocaleString()} Total</div>
										<div className="text-sm sm:text-sm lg:text-base bg-green-960 text-green-940 px-4 py-1 rounded-full">{drop.price} ETH</div>
									</div>

									<div className="hidden lg:flex lg:flex-row">
										<div className="bg-dark-900 px-6 py-1 rounded-full font-bold">
											Release Date: {moment(drop.releaseDate).tz('America/New_York').format('lll z')}
										</div>
									</div>

									<div className="flex flex-row lg:hidden">
										<div className="text-sm sm:text-sm bg-dark-900 px-4 py-1 rounded-full font-bold">
											Release Date: {moment(drop.releaseDate).tz('America/New_York').format('lll z')}
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				))}

				{upcoming.map((drop, i: number) => (
					<motion.div whileHover={{ scale: 1.02 }} key={i} className="relative bg-dark-800 p-4 rounded">
						<div className="flex flex-row md:space-x-4">
							<div>
								<img src={drop.imageUrl} className="hidden md:block h-full w-44 rounded" />
							</div>

							<div className="flex flex-col flex-1 space-y-4">
								<div className="md:hidden flex flex-row items-center space-x-4">
									<img src={drop.imageUrl} className="h-full w-24 rounded" />
									<div className="flex flex-col">
										<div className="text-lg sm:text-2xl font-bold">{drop.name}</div>
										<div className="text-sm line-clamp-2">{drop.description}</div>
									</div>
								</div>

								<div className="hidden md:flex md:flex-col">
									<div className="text-2xl font-bold">{drop.name}</div>
									<div className="text-base h-12 line-clamp-2">{drop.description}</div>
								</div>

								<div className="flex flex-row items-center space-x-4">
									{drop.externalUrl ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<ExternalLinkIcon className="h-5 w-5 mr-1" />
											Website
										</div>
									) : null}
									{drop.twitterUsername ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<svg className="h-4 w-4 fill-current text-gray-300 mr-1" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<title>Twitter</title>
												<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
											</svg>
											@{drop.twitterUsername}
										</div>
									) : null}
									{drop.discordUrl ? (
										<div className="flex flex-row items-center text-gray-300 underline cursor-pointer capitalize">
											<svg className="h-4 w-4 fill-current text-gray-300 mr-2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<title>Discord</title>
												<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
											</svg>
											Discord
										</div>
									) : null}
								</div>

								<div className="flex flex-col space-y-2 lg:flex-row lg:justify-between lg:items-end lg:space-x-2">
									<div className="flex flex-row items-center space-x-2">
										<div className="text-sm sm:text-sm lg:text-base bg-dark-900 px-4  py-1 rounded-full">{drop.supply.toLocaleString()} Total</div>
										<div className="text-sm sm:text-sm lg:text-base bg-green-960 text-green-940 px-4 py-1 rounded-full">{drop.price} ETH</div>
									</div>

									<div className="hidden lg:flex lg:flex-row">
										<div className="bg-dark-900 px-6 py-1 rounded-full font-bold">
											Release Date: {moment(drop.releaseDate).tz('America/New_York').format('lll z')}
										</div>
									</div>

									<div className="flex flex-row lg:hidden">
										<div className="text-sm sm:text-sm bg-dark-900 px-4 py-1 rounded-full font-bold">
											Release Date: {moment(drop.releaseDate).tz('America/New_York').format('lll z')}
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</Layout>
		</>
	);
};

export const getServerSideProps = async () => {
	const select = {
		imageUrl: true,
		name: true,
		description: true,
		price: true,
		releaseDate: true,
		supply: true,
		currency: true,
		twitterUsername: true,
		discordUrl: true,
		externalUrl: true,
	};

	const featured = await prisma.upcoming.findMany({
		where: { featured: true },
		orderBy: { releaseDate: 'asc' },
		select,
	});

	const upcoming = await prisma.upcoming.findMany({
		where: { featured: false, releaseDate: { gt: moment().startOf('day').toISOString() } },
		orderBy: { releaseDate: 'asc' },
		select,
	});

	return {
		props: {
			featured,
			upcoming,
		},
	};
};

export default Upcoming;
