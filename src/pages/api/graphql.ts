import type { PageConfig } from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { schema } from '@root/graphql/schema';
import { createContext } from '@root/graphql/context';

const apolloServer = new ApolloServer({
  context: createContext,
  schema,
  debug: true,
  introspection: true,
});

const startServer = apolloServer.start();

export default async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
