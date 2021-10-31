import type { InferGetServerSidePropsType, NextPage } from 'next';

import { getFeaturedCollections, getCollections, getLatestCollections } from '@root/utils/cache';

import { renderMarkdown } from '@root/utils/markdown';

import Layout from '@root/ui/components/Layout';
import Navbar from '@root/ui/components/Navbar';
import Card from '@root/ui/components/Collections/Card';
import AllCollections from '@root/ui/components/Collections/All';

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ featured, collections, latest }) => {
	return (
		<>
			<Navbar />

			<Layout>
				<div>
					<span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">Featured Collections</span>
				</div>

				<div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{featured.map((feature: any, i: number) => (
						<Card key={i} featured={true} collection={feature.collection} />
					))}
					{latest.map((collection: any, i: number) => (i < 9 - featured.length ? <Card key={i} featured={false} collection={collection} /> : null))}
				</div>

				<AllCollections collections={collections} />
			</Layout>
		</>
	);
};

export const getServerSideProps = async () => {
	const collections = await getCollections();
	const featured = await getFeaturedCollections();
	const latest = await getLatestCollections();

	return {
		props: {
			collections,
			featured,
			latest,
		},
	};
};

export default Home;
