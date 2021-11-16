import type { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment-timezone';

import prisma from '@root/utils/prisma';

const times = ['5m', '10m', '30m', '1h', '6h'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { time } = req.query;

  if (!time || !times.includes(time as string))
    return res.status(400).json({ message: 'Invalid Time Parameter' });

  let startDate: string = '';

  switch (time) {
    case '5m':
      startDate = moment.utc().subtract('5', 'minutes').toISOString();
      break;
    case '10m':
      startDate = moment.utc().subtract('10', 'minutes').toISOString();
      break;
    case '30m':
      startDate = moment.utc().subtract('30', 'minutes').toISOString();
      break;
    case '1h':
      startDate = moment.utc().subtract('1', 'hours').toISOString();
      break;
    case '6h':
      startDate = moment.utc().subtract('6', 'hours').toISOString();
  }

  const collections = await prisma.mintCollection.findMany({
    where: {
      show: true,
      mints: {
        some: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    },
    select: {
      contract: true,
      name: true,
      slug: true,
      imageUrl: true,
      bannerImageUrl: true,
      medias: true,
      mints: {
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          eth: true,
          count: true,
          createdAt: true,
        },
      },
    },
  });

  const format = await Promise.all(
    collections.map(async collection => {
      const eth = collection.mints.reduce((prev, transaction) => prev + transaction.eth, 0);

      return {
        ...collection,
        eth,
      };
    })
  );

  return res.status(200).json({ collections: format.sort((a, b) => b.eth - a.eth).slice(0, 30) });
}
