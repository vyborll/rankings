import { CollectionIcon, ClipboardListIcon } from '@heroicons/react/outline';

const links = [
  {
    href: '/collections',
    name: 'Collections',
    icon: <CollectionIcon className="h-4 w-4 mr-2" />,
  },
  {
    href: '/drops/upcoming',
    name: 'Upcoming',
    icon: <ClipboardListIcon className="h-4 w-4 mr-2" />,
  },
];

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-row items-center px-20 py-6 bg-dark-950 static top-0 border-b border-divider-900">
      <div className="border-r border-divider-900 pr-8">
        <div className="text-2xl font-bold uppercase italic">
          NFT<span className="text-green-950">Ranks</span>
        </div>
      </div>
      <div className="flex flex-row ml-8 space-x-8">
        {links.map((link, i) => (
          <div key={i} className="flex flex-row items-center cursor-pointer text-dark-700 hover:text-white font-semibold">
            {link.icon}
            {link.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
