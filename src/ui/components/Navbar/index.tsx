import { useRouter } from 'next/router';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import { CollectionIcon, ClipboardListIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const links = [
	{
		href: '/',
		name: 'Collections',
		icon: <CollectionIcon className="h-4 w-4 mr-2" />,
		pathnames: ['/'],
	},
	{
		href: '/drops',
		name: 'Drops',
		icon: <ClipboardListIcon className="h-4 w-4 mr-2" />,
		pathnames: ['/drops'],
	},
];

const social = [
	{
		href: 'https://discord.gg/randomlinkhere',
		name: 'Discord',
		icon: (
			<svg className="h-5 w-5 fill-current text-dark-700 hover:text-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<title>Discord</title>
				<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
			</svg>
		),
	},
	{
		href: 'https://twitter.com/nftranks',
		name: 'Twitter',
		icon: (
			<svg className="h-5 w-5 fill-current text-dark-700 hover:text-white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<title>Twitter</title>
				<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
			</svg>
		),
	},
];

const classNames = (...classes: string[]) => {
	return classes.filter(Boolean).join(' ');
};

const Navbar: React.FC = () => {
	const { pathname } = useRouter();

	return (
		<Disclosure as="nav" className="sticky top-0 h-16 z-10">
			{({ open }) => (
				<>
					<div className="flex flex-row items-center px-6 lg:px-10 py-4 bg-dark-950 sticky h-16 top-0 z-50 border-b border-divider-900">
						<div className="absolute inset-y-0 left-4 flex items-center sm:hidden">
							<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-white hover:bg-dark-800">
								<span className="sr-only">Open Menu</span>
								{open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
							</Disclosure.Button>
						</div>

						<div className="hidden sm:block border-r border-divider-900 pr-8">
							<Link href="/">
								<a className="text-2xl font-black uppercase italic">
									NFT<span className="text-green-940">Ranks</span>
								</a>
							</Link>
						</div>

						<div className="sm:hidden flex flex-1 items-center justify-center">
							<Link href="/">
								<a className="text-2xl font-black uppercase italic">
									NFT<span className="text-green-940">Ranks</span>
								</a>
							</Link>
						</div>

						<div className="hidden sm:flex sm:flex-1 flex-row justify-between">
							<div className="flex flex-row ml-8 space-x-8">
								{links.map((link, i) => (
									<Link href={link.href} key={i}>
										<a
											className={classNames(
												pathname === link.pathnames.find((p) => p.toLowerCase() === pathname.toLowerCase())
													? 'flex flex-row items-center text-white font-semibold'
													: 'flex flex-row items-center text-dark-700 hover:text-white font-semibold',
											)}
										>
											{link.icon}
											{link.name}
										</a>
									</Link>
								))}
							</div>
							<div className="hidden md:flex flex-row space-x-6">
								<Link href="/list">
									<a className="text-dark-700 hover:text-white font-semibold underline">List your project</a>
								</Link>
								{social.map((link, i) => (
									<div key={i} className="flex flex-row items-center cursor-pointer text-dark-700 hover:text-white font-semibold">
										{link.icon}
									</div>
								))}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="flex flex-col bg-dark-900 p-4 space-y-3 border-b border-divider-900">
							{links.map((link, i) => (
								<Link href={link.href} key={i}>
									<a
										className={classNames(
											pathname === link.pathnames.find((p) => p.toLowerCase() === pathname.toLowerCase())
												? 'flex flex-row items-center px-3 py-2 bg-dark-800 rounded'
												: 'flex flex-row items-center px-3 py-2 hover:bg-dark-800 rounded',
										)}
									>
										{link.icon}
										{link.name}
									</a>
								</Link>
							))}

							<div className="flex flex-row pl-3 space-x-4">
								{social.map((social, i) => (
									<Link href={social.href} key={i}>
										<a>{social.icon}</a>
									</Link>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default Navbar;
