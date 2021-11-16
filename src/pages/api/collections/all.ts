import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@root/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collections = await prisma.collection.findMany({
    where: { show: true },
    select: {
      blockchain: true,
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      oneDayVolume: true,
      oneDayChange: true,
      oneDaySales: true,
      oneDayAveragePrice: true,
      sevenDayVolume: true,
      sevenDayChange: true,
      sevenDaySales: true,
      sevenDayAveragePrice: true,
      thirtyDayVolume: true,
      thirtyDayChange: true,
      thirtyDaySales: true,
      thirtyDayAveragePrice: true,
      totalVolume: true,
      totalSales: true,
      totalSupply: true,
      numOwners: true,
      averagePrice: true,
      marketCap: true,
      createdAt: true,
    },
    orderBy: { totalVolume: 'desc' },
  });

  return res.status(200).json({ collections });
}
