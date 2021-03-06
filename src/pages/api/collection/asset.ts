import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@root/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Invalid Method' });

  const slug = req.query.slug as string;
  const tokenId = req.query.tokenId as string;

  const asset = await prisma.asset.findFirst({
    where: {
      slug,
      tokenId,
    },
    select: {
      tokenId: true,
      name: true,
      image: true,
      defaultRank: true,
      defaultScore: true,
      metadata: true,
    },
  });

  if (!asset) return res.status(400).json({ success: false, message: 'No asset found' });

  return res.status(200).json({ success: true, asset });
}
