import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@root/utils/prisma';
import { getAssets } from '@root/utils/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Invalid Method' });
  if (!req.query.slug || !req.query.page || isNaN(parseInt(req.query.page as string)))
    return res.status(400).json({ success: false, message: 'Invalid Parameters' });

  const slug = req.query.slug as string;
  const page = parseInt(req.query.page as string);

  delete req.query.slug;
  delete req.query.page;

  if (Object.keys(req.query).length === 0) {
    const { assets, count } = await getAssets(slug, page);

    return res
      .status(200)
      .json({ success: true, assets, count: count.assets, page, maxPage: count.maxPage });
  } else {
    const filters: any[] = [];

    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        filters.push({ key, value: key === 'Trait Count' ? parseInt(value) : value });
      }

      if (Array.isArray(value)) {
        value.map(v => filters.push({ key, value: key === 'Trait Count' ? parseInt(v) : v }));
      }
    }

    const [assets, count] = await prisma.$transaction([
      prisma.asset.findMany({
        where: {
          slug,
          metadata: {
            hasEvery: filters,
          },
        },
        select: {
          tokenId: true,
          name: true,
          image: true,
          defaultRank: true,
          defaultScore: true,
          metadata: true,
        },
        orderBy: [{ defaultRank: 'asc' }, { tokenId: 'asc' }],
        skip: page * 25 - 25,
        take: 25,
      }),
      prisma.asset.count({
        where: {
          slug,
          metadata: {
            hasEvery: filters,
          },
        },
      }),
    ]);

    return res
      .status(200)
      .json({ success: true, assets, count, page, maxPage: Math.ceil(count / 25) });
  }
}
