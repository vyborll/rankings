import type { ApolloError } from '@apollo/client';

interface Props {
	loading: boolean;
	error: ApolloError | undefined;
	upcoming: {
		name: string;
		description: string;
		price: number;
		supply: number;
		twitterUsername: string | null;
		discordUrl: string | null;
		externalUrl: string | null;
	}[];
}

const Upcoming: React.FC = () => {
	return (
		<>
			<div>
				<span className="text-2xl font-bold mb-1 border-b border-green-950 pb-1">Upcoming NFT Drops</span>
			</div>
		</>
	);
};

export default Upcoming;
