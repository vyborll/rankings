import type { CollectionCard } from '@root/types';
import Link from 'next/link';
import { ExternalLinkIcon } from '@heroicons/react/outline';

interface Props {
	featured: boolean;
	collection: CollectionCard;
}

const Card: React.FC<Props> = ({ featured, collection }) => {
	console.log(collection.imageUrl);

	return (
		<div className={`bg-dark-800 p-4 rounded relative overflow-hidden ${featured ? 'border border-green-950' : ''}`}>
			{featured && <div className="ribbon bg-green-950 text-base font-bold whitespace-no-wrap px-10 py-1">Featured</div>}
			<div className="space-y-4">
				<div className="flex flex-row items-center">
					<div>
						<img src={collection.imageUrl ?? ''} className="rounded h-20 w-20" />
					</div>
					<div className="flex flex-1 flex-col pl-4 space-y-1">
						<div className="text-xl font-bold line-clamp-1 sm:line-clamp-2">{collection.name}</div>
						<div className="bg-dark-900 rounded-full text-center text-sm py-1 font-thin w-40">{collection.totalSupply.toLocaleString()} Assets</div>
					</div>
				</div>
				<div className="h-20 text-sm line-clamp-4">{collection.description}</div>
				<div className="h-5 flex flex-row space-x-4">
					{collection.externalUrl ? (
						<Link href={collection.externalUrl}>
							<a target="_blank" className="text-sm flex flex-row items-center underline">
								<ExternalLinkIcon className="h-3 w-3 md:h-4 md:w-4 mr-2" />
								Website
							</a>
						</Link>
					) : null}

					{collection.twitterUsername ? (
						<Link href={`https://twitter.com/${collection.twitterUsername}`}>
							<a target="_blank" className="text-sm flex flex-row items-center underline">
								<svg className="h-3 w-3 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<title>Twitter</title>
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
								Twitter
							</a>
						</Link>
					) : null}

					{collection.discordUrl ? (
						<Link href={collection.discordUrl}>
							<a target="_blank" className="text-sm flex flex-row items-center underline">
								<svg className="h-3 w-3 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<title>Discord</title>
									<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
								</svg>
								Discord
							</a>
						</Link>
					) : null}
				</div>
				<div className="flex items-end">
					<Link href={`/collection/${collection.slug}`}>
						<a className="bg-dark-900 w-full py-2 rounded text-center">View</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Card;
