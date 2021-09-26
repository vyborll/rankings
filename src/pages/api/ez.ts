import opensea from '@root/utils/lib/opensea';

import prisma from '@root/utils/lib/prisma';

export default async function handler(req: any, res: any) {
	await opensea.getAllCollections();

	const guttercatgang = await prisma.collection.findUnique({ where: { slug: 'guttercatgang' } });
	await opensea.getAllAssets(guttercatgang?.slug ?? 'guttercatgang', guttercatgang?.totalSupply ?? 300);

	// const cryptopunks = await prisma.collection.findUnique({ where: { slug: 'cryptopunks' } });
	// await opensea.getAllAssets(cryptopunks?.slug ?? 'cryptopunks', cryptopunks?.totalSupply ?? 9999);

	return res.json({
		success: true,
	});
}
