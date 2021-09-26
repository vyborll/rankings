import type { NextPage } from 'next';

import Navbar from '@root/ui/components/Navbar';
import Layout from '@root/ui/components/Layout';

const List: NextPage = () => {
	return (
		<>
			<Navbar />

			<Layout>
				<div>List your project</div>
			</Layout>
		</>
	);
};

export default List;
