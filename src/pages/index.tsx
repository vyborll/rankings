import type { NextPage } from 'next';
import Image from 'next/image';
import { gql, useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';
import Featured from '@root/ui/components/Collections/Featured';
import AllCollections from '@root/ui/components/Collections/All';

const getCollectionsQuery = gql`
	query {
		collections {
			name
			slug
			imageUrl
			description
			sevenDayVolume
			sevenDaySales
			totalVolume
			totalSales
			totalSupply
			numOwners
			externalUrl
			discordUrl
			twitterUsername
		}
	}
`;

const Home: NextPage = () => {
	const { loading, error, data } = useQuery(getCollectionsQuery);

	return (
		<>
			<Navbar />

			<Layout>
				<Featured loading={loading} error={error} collections={data?.collections ?? []} />
				<AllCollections loading={loading} error={error} collections={data?.collections ?? []} />
			</Layout>
		</>
	);
};

export default Home;
