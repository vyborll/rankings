import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@root/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const featured = await prisma.featured.findMany({
    where: { type: 'collection', active: true },
    select: {
      collection: {
        select: {
          blockchain: true,
          slug: true,
          name: true,
          imageUrl: true,
          description: true,
          totalSupply: true,
          medias: true,
        },
      },
    },
    orderBy: { slot: 'asc' },
  });

  return res.status(200).json({ featured });
}
