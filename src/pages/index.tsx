import type { NextPage } from 'next';
import { gql, useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';

import Card from '@root/ui/components/Collections/Card';

import AllCollections from '@root/ui/components/Collections/All';

const getCollectionsQuery = gql`
	query {
		featured {
			collection {
				name
				slug
				imageUrl
				description
				totalSupply
				externalUrl
				discordUrl
				twitterUsername
			}
		}

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

	console.log(data);

	return (
		<>
			<Navbar />

			<Layout>
				<div>
					<span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">Featured Collections</span>
				</div>

				<div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{!loading && data.featured.map((feature: any, i: number) => <Card key={i} featured={true} collection={feature.collection} />)}
					{!loading &&
						data.collections
							.slice(Math.max(data.collections.length - 7, 0))
							.reverse()
							.map((collection: any, i: number) => <Card key={i} featured={false} collection={collection} />)}
				</div>

				<AllCollections loading={loading} error={error} collections={data?.collections ?? []} />
			</Layout>
		</>
	);
};

export default Home;
