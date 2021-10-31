import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@root/utils/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { name, info } = req.query;
}
