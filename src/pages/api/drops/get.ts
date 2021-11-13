import type { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment-timezone';

import prisma from '@root/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startDate = moment.utc().startOf('day').toISOString();

  const projects = await prisma.project.findMany({
    where: {
      featured: false,
      releaseDate: {
        gte: startDate,
      },
    },
    select: {
      name: true,
      image: true,
      description: true,
      price: true,
      supply: true,
      website: true,
      discord: true,
      twitterUsername: true,
      releaseDate: true,
    },
    orderBy: {
      releaseDate: 'desc',
    },
  });

  return res.status(200).json({ projects });
}
