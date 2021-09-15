import type { ApolloError } from '@apollo/client';

interface Props {
  loading: boolean;
  error: ApolloError | undefined;
  upcoming: {
    name: string;
    description: string;
    price: number;
    supply: number;
    twitter_username: string | null;
    discord_url: string | null;
    external_url: string | null;
  }[];
}

const Upcoming: React.FC<Props> = ({ loading, upcoming }) => {
  return (
    <div>
      <p>hello</p>
    </div>
  );
};

export default Upcoming;
