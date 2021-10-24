import type { NextPage } from 'next';

import Navbar from '@root/ui/components/Navbar';
import Layout from '@root/ui/components/Layout';

const List: NextPage = () => {
	return (
		<>
			<Navbar />

			<div className="lg:max-w-3xl lg:mx-auto py-6 md:py-10 px-3 md:px-6 space-y-6">
				<div className="text-center text-3xl font-bold underline">List your project on NFTRanks</div>

				<div className="space-y-1">
					<div className="text-2xl font-semibold">Listing:</div>
					<div>
						Currently the listing fee is <span className="text-green-940 border-b border-green-940">1 ETH</span> per project with rankings. This will
						help us pay for the server costs and maintain the service we are providing to the community.
					</div>
				</div>

				<div style={{ height: '100%' }}>
					<iframe
						src="https://docs.google.com/forms/d/e/1FAIpQLSfcJhK0APoXYONvUHKbY5awWnmLJLeHhm0UmNGkVqbktD-6MA/viewform?embedded=true"
						style={{ width: '100%', height: 1500 }}
						frameBorder="0"
						marginHeight={0}
						marginWidth={0}
					>
						Loading…
					</iframe>
				</div>
			</div>
		</>
	);
};

export default List;
