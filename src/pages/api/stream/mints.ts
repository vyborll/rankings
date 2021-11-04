import type { NextApiRequest, NextApiResponse } from 'next';

import web3 from '@root/lib/web3';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const subscription = web3.eth.subscribe('pendingTransactions');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  // for (let i = 0; i < 100; i++) {
  // res.write(JSON.stringify({ message: 'Hello' }));
  // await sleep(5000);
  // }

  res.write('Hello');

  subscription.subscribe().on('data', async hash => {
    console.log(hash);
    res.write(JSON.stringify({ data: hash }));
  });
}
