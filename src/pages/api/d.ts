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

  // Update Trait Scores
  const transactions: any[] = [];

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

  const ezr = await prisma.asset.findUnique({
    where: {
      assetId: 'boredapeyachtclub_3',
    },
    select: {
      id: true,
      name: true,
      traits: {
        select: {
          traitType: true,
          percentile: true,
          rarityScore: true,
        },
      },
    },
  });

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

  const collection = await prisma.collection.findUnique({
    where: {
      slug: 'boredapeyachtclub',
    },
    include: {
      attribute: {
        include: {
          trait: true,
        },
      },
    },
  });

  return res.json({
    success: true,
    ezr,
    collection,
    rarity_score: ezr ? ezr.traits.reduce((acc, a) => acc + (a.rarityScore ?? 0), 0) : 0,
  });
}

const chunkArray = (transactions: any[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(transactions.length / chunkSize) }, (_, i) => transactions.slice(i * chunkSize, (i + 1) * chunkSize));
};
