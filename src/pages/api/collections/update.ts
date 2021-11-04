import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

import prisma from '@root/utils/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collections = await prisma.collection.findMany({
    orderBy: {
      sevenDayVolume: 'desc',
    },
  });

  await Promise.all(collections.map(async collection => {}));
}
