import prisma from '@root/utils/lib/prisma';

export default async function handler(req: any, res: any) {
	const assets = await prisma.rank.findFirst({
		where: { tokenId: '1' },
		select: {
			asset: {
				select: {
					tokenId: true,
					name: true,
				},
			},
		},
	});

	console.log(assets);

	return res.status(200).json({ assets });
}
