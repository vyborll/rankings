import _ from 'lodash';

import prisma from '@root/utils/lib/prisma';

export default async function handler(req: any, res: any) {
	// const collectionAttributes = await prisma.trait.findMany({
	//   where: {
	//     attribute: {
	//       collection: {
	//         slug: 'cryptopunks',
	//       },
	//     },
	//   },
	// });

	// const attributes = await prisma.collection.findUnique({
	//   where: {
	//     slug: 'boredapeyachtclub',
	//   },
	//   include: {
	//     attribute: {
	//       include: {
	//         trait: true,
	//       },
	//     },
	//   },
	// });

	// const asset = await prisma.asset.findUnique({
	//   where: { assetId: 'boredapeyachtclub_0' },
	//   select: {
	//     tokenId: true,
	//     name: true,
	//     imageUrl: true,
	//     traits: {
	//       select: {
	//         traitType: true,
	//         attribute: {
	//           select: {
	//             attributeType: true,
	//           },
	//         },
	//       },
	//     },
	//   },
	// });

	// const traits = await prisma.collection.findUnique({
	//   where: {
	//     slug: 'boredapeyachtclub',
	//   },
	//   select: {
	//     id: true,
	//     slug: true,
	//     totalSupply: true,
	//     attribute: {
	//       select: {
	//         id: true,
	//         attributeType: true,
	//         attributeCount: true,
	//         trait: {
	//           select: {
	//             id: true,
	//             traitType: true,
	//             traitCount: true,
	//             percentile: true,
	//             rarityScore: true,
	//           },
	//         },
	//       },
	//     },
	//   },
	// });

	// Update Attribute Count
	// if (traits) {
	//   await Promise.all(
	//     traits.attribute.map(async (attr) => {
	//       let totalCount = 0;

	//       await Promise.all(
	//         attr.trait.map(async (trait) => {
	//           if (trait.traitType === 'None') return;
	//           totalCount += trait.traitCount;
	//         })
	//       );

	//       transactions.push(
	//         prisma.attribute.update({
	//           where: { id: attr.id },
	//           data: { attributeCount: totalCount },
	//         })
	//       );
	//     })
	//   );
	// }

	// if (traits) {
	//   await Promise.all(
	//     traits.attribute.map(async (attr) => {
	//       await Promise.all(
	//         attr.trait.map(async (trait) => {
	//           transactions.push(
	//             prisma.trait.update({
	//               where: { id: trait.id },
	//               data: {
	//                 percentile: trait.traitCount / traits.totalSupply ?? 0,
	//                 rarityScore: traits.totalSupply / trait.traitCount ?? 0,
	//               },
	//             })
	//           );
	//         })
	//       );
	//     })
	//   );
	// }

	// const chunks = chunkArray(transactions, 250);
	// for (const chunk of chunks) {
	//   console.log(chunk.length);
	//   await prisma.$transaction(chunk);
	// }

	// await Promise.all(
	//   assets.map(async (asset) => {
	//     transactions.push(
	//       prisma.trait.update({
	//         where: { id: asset.id },
	//         data: {
	//           percentile:
	//         }
	//       })
	//     )
	//   })
	// )

	// Update Asset Attribute Count
	// const assets = await prisma.asset.findMany({
	// 	where: {
	// 		collection: {
	// 			slug: "boredapeyachtclub"
	// 		}
	// 	},
	// });

	// const allAttributeCounts: any = {};
	// const transactions: any[] = [];
	
	// await Promise.all(
	// 	assets.map((a) => {
	// 		if (!allAttributeCounts.hasOwnProperty(a.attributeCount)) {
	// 			allAttributeCounts[a.attributeCount] = 1;
	// 		} else {
	// 			allAttributeCounts[a.attributeCount] = allAttributeCounts[a.attributeCount] + 1;
	// 		}
	// 	})
	// )

	// console.log(allAttributeCounts);

	// await Promise.all(
	// 	assets.map((a) => {
	// 		transactions.push(prisma.asset.update({
	// 			where: { id: a.id },
	// 			data: {
	// 				attributeScore: assets.length / allAttributeCounts[a.attributeCount]
	// 			}
	// 		}))
	// 	})
	// )

	// const chunks = chunkArray(transactions, 250);
	// for (const chunk of chunks) {
	// 	console.log(chunk.length);
	// 	await prisma.$transaction(chunk);
	// }

	// Update Trait Scores
	// const transactions: any[] = [];
	
	// const traits = await prisma.collection.findUnique({
	// 	where: { slug: "boredapeyachtclub" },
	// 	select: {
	// 		slug: true,
	// 		totalSupply: true,
	// 		attribute: {
	// 			select: {
	// 				attributeType: true,
	// 				trait: {
	// 					select: {
	// 						traitId: true,
	// 						traitCount: true,
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	// if (traits) {
	// 	await Promise.all(
	// 		traits.attribute.map(async (attribute) => {
	// 			await Promise.all(
	// 				attribute.trait.map(async (trait) => {
	// 					transactions.push(prisma.trait.update({
	// 						where: { traitId: trait.traitId },
	// 						data: {
	// 							percentile: trait.traitCount / traits.totalSupply,
	// 							rarityScore: traits.totalSupply / trait.traitCount
	// 						},
	// 					}))
	// 				})
	// 			)
	// 		})
	// 	)
	// }

	// const chunks = chunkArray(transactions, 250);
	// for (const chunk of chunks) {
	// 	console.log(chunk.length);
	// 	await prisma.$transaction(chunk);
	// }

	// Add Scores
	// const transactions: any[] = [];

	// const assets = await prisma.asset.findMany({
	// 	where: {
	// 		collection: {
	// 			slug: "boredapeyachtclub",
	// 		}
	// 	},
	// 	select: {
	// 		id: true,
	// 		tokenId: true,
	// 		name: true,
	// 		attributeScore: true,
	// 		traits: {
	// 			select: {
	// 				rarityScore: true,
	// 			}
	// 		},
	// 		collection: {
	// 			select: {
	// 				slug: true
	// 			}
	// 		}
	// 	},
	// });

	// const needToRankList: { id: string; slug: string; tokenId: string; rarityScore: number; }[] = [];
	// const rankScores: number[] = [];

	// await Promise.all(
	// 	assets.map(async (a) => {
	// 		const traitScore = a.traits.reduce((acc, a) => acc + (a.rarityScore ?? 0), a.attributeScore ?? 0);
	// 		needToRankList.push({ id: a.id, slug: a.collection.slug, tokenId: a.tokenId, rarityScore: traitScore });
	// 		rankScores.push(traitScore);
	// 	})
	// )

	// const sorted = rankScores.sort((a, b) => b - a);
	// const ranks = needToRankList.map((x) => ({ ...x, rank: sorted.indexOf(x.rarityScore) + 1 })).sort((a, b) => b.rarityScore - a.rarityScore);

	// await Promise.all(
	// 	ranks.map((x) => {
	// 		transactions.push(prisma.score.upsert({
	// 			where: { scoreId: `${x.slug}_${x.tokenId}_default` },
	// 			update: {},
	// 			create: {
	// 				scoreId: `${x.slug}_${x.tokenId}_default`,
	// 				type: "default",
	// 				rarityRank: x.rank,
	// 				rarityScore: x.rarityScore,
	// 				assetId: x.id
	// 			}
	// 		}))
	// 	})
	// )

	// const chunks = chunkArray(transactions, 300);
	// for (const chunk of chunks) {
	// 	console.log(chunk.length);
	// 	await prisma.$transaction(chunk);
	// }

	// Get Top 10 Assets by ranks
	const topAssets = await prisma.score.findMany({
		where: {
			type: "default",
			asset: {
				collection: {
					slug: 'boredapeyachtclub'
				}
			}
		},
		select: {
			type: true,
			rarityRank: true,
			rarityScore: true,
			asset: {
				select: {
					tokenId: true,
					name: true,
					imageUrl: true,
					traits: {
						select: {
							traitType: true,
							traitCount: true,
							rarityScore: true,
							attribute: {
								select: {
									attributeType: true
								}
							}
						}
					}
				}
			},
		},
		orderBy: {
			rarityRank: 'asc'
		},
		take: 20
	});
	
	return res.json({
		success: true,
		topAssets,
		// rarity_score: ezr ? ezr.traits.reduce((acc, a) => acc + (a.rarityScore ?? 0), 0) : 0,
	});
}

const chunkArray = (transactions: any[], chunkSize: number) => {
	return Array.from({ length: Math.ceil(transactions.length / chunkSize) }, (_, i) => transactions.slice(i * chunkSize, (i + 1) * chunkSize));
};
