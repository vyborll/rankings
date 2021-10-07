import puppeteer from 'puppeteer';
import _ from 'lodash';

import prisma from '@root/utils/lib/prisma';

class OpenSea {
	BROWSER: puppeteer.Browser | null;

	constructor() {
		this.BROWSER = null;
	}

	async getAssets(slug: string) {
		console.log(slug);
		if (!slug) throw new Error('Invalid Slug');

		const collection = await prisma.collection.findUnique({
			where: {
				slug,
			},
			include: {
				attribute: {
					include: {
						trait: true,
					},
				},
			},
		});

		if (!collection) throw new Error('No collection was found');

		if (!this.BROWSER) {
			this.BROWSER = await puppeteer.launch({ headless: false, devtools: true });
		}

		const page = await this.BROWSER.newPage();
		await page.goto('https://opensea.io', {
			waitUntil: 'networkidle2',
		});

		const pages = Math.ceil(collection.totalSupply / 100);
		const query = await this.getAssetsQuery();
		let currentPage: number = 1;
		let cursor = '';

		const attributeTraitList: { key: number; id: string }[] = [];
		const traitCountType: any = {};
		const transactions: any[] = [];

		while (currentPage <= pages) {
			console.log(`Page: ${currentPage}`);
			console.log(cursor);
			let data: any;

			await new Promise(async (resolve) => {
				setTimeout(async () => {
					data = await this.sendRequest(page, query, [collection.slug], cursor);
					cursor = data.data.search.pageInfo.endCursor;
					resolve(true);
				}, 6000);
			});

			await Promise.all(
				data.data.search.edges.map(async (asset: any) => {
					const tokenId = asset.node.asset.tokenId;
					const name = asset.node.asset.name ?? `${collection?.name} #${tokenId}`;
					const thisAssetTraits: string[] = [];
					let thisAssetTraitsCount: number = 0;

					await Promise.all(
						collection.attribute.map(async (attr) => {
							const assetHasAttribute = asset.node.asset.traits.edges.find((t: any) => t.node.traitType === attr.attributeType);

							if (assetHasAttribute) {
								const assetHasTrait = attr.trait.find((trait) => trait.traitType === assetHasAttribute.node.value);
								assetHasTrait ? thisAssetTraits.push(assetHasTrait.id) : null;
								thisAssetTraitsCount += 1;
							} else {
								const assetNoneTrait = attr.trait.find((trait) => trait.traitType === 'None');
								assetNoneTrait ? thisAssetTraits.push(assetNoneTrait.id) : null;
							}
						}),
					);

					// Keep Track of the total attribute counts
					if (!traitCountType.hasOwnProperty(thisAssetTraitsCount)) {
						traitCountType[thisAssetTraitsCount] = 1;
					} else {
						traitCountType[thisAssetTraitsCount] = traitCountType[thisAssetTraitsCount] + 1;
					}

					console.log(`${name} - has ${thisAssetTraitsCount} Attributes`);

					// const attributeExist = collection.attribute.find((a) => a.attributeType === 'Attribute Count');
					// if (attributeExist) {
					// 	const traitExist = attributeExist.trait.find((t) => t.traitType === `${thisAssetTraitsCount}`);
					// 	if (!traitExist) {
					// 		if (!attributeTraitList.hasOwnProperty(`${thisAssetTraitsCount}`)) {
					// 			// Create and save trait Id for other assets
					// 			const createdTrait = await prisma.trait.upsert({
					// 				where: { traitId: `${collection.slug}_Attributes_${thisAssetTraitsCount}` },
					// 				update: {},
					// 				create: {
					// 					traitId: `${collection.slug}_Attributes_${thisAssetTraitsCount}`,
					// 					traitType: `${thisAssetTraitsCount}`,
					// 					traitCount: 1,
					// 					attributeId: attributeExist.id,
					// 				},
					// 			});

					// 			attributeTraitList[thisAssetTraitsCount] = createdTrait.id;
					// 			thisAssetTraits.push(createdTrait.id);
					// 		} else {
					// 			thisAssetTraits.push(attributeTraitList[thisAssetTraitsCount]);
					// 		}
					// 	} else {
					// 		console.log(`Trait Found - ${traitExist.traitType}`);
					// 		thisAssetTraits.push(attributeTraitList[thisAssetTraitsCount]);
					// 	}
					// }

					// const doesAttributeExist = collection.attribute.find((a) => a.attributeType === 'Attribute Count');
					// if (doesAttributeExist) {
					//   const doesTraitExist = doesAttributeExist.trait.find((t) => t.traitType === `${thisAssetTraitsCount}`);
					//   if (doesTraitExist) {
					//     thisAssetTraits.push(doesTraitExist.id);
					//   } else {
					//     const createTrait = await prisma.trait.upsert({
					//       where: { traitId: `${collection.slug}_Attributes_${thisAssetTraitsCount}` },
					//       update: {},
					//       create: {
					//         traitId: `${collection.slug}_Attributes_${thisAssetTraitsCount}`,
					//         traitType: `${thisAssetTraitsCount}`,
					//         traitCount: 1,
					//         attributeId: doesAttributeExist.id,
					//       },
					//     });

					//     thisAssetTraits.push(createTrait.id);
					//   }
					// }

					// Save the total attribute count id
					// if (!attributeTraitCount.hasOwnProperty(thisAssetTraitsCount)) {
					//   const attributeCount = await prisma.trait.upsert({
					//     where: { traitId: `${collection.slug}_Attribute_${thisAssetTraitsCount}` },
					//     update: {},
					//     create: {
					//       traitId: `${collection.slug}_Attribute_${thisAssetTraitsCount}`,
					//       traitType: `${thisAssetTraitsCount}`
					//       traitCount: 1,
					//     }
					//   })
					// }

					transactions.push(
						prisma.asset.upsert({
							where: { assetId: `${collection.slug}_${tokenId}` },
							update: {},
							create: {
								assetId: `${collection.slug}_${tokenId}`,
								tokenId,
								name: name ?? `${collection.name} #${tokenId}`,
								imageUrl: asset.node.asset.imageUrl,
								collectionId: collection.id,
								traitIds: thisAssetTraits,
								attributeCount: thisAssetTraitsCount
							},
						}),
					);
				}),
			);

			console.log(traitCountType);

			currentPage += 1;
		}

		const chunks = this.chunkArray(transactions, 250);
		for (const chunk of chunks) {
			console.log(chunk.length);
			await prisma.$transaction(chunk);
		}
	}

	async sendRequest(page: puppeteer.Page, query: string, slugs: string[], cursor: string) {
		return await page.evaluate(
			async (query) => {
				return fetch('https://api.opensea.io/graphql/', {
					headers: {
						accept: '*/*',
						'accept-language': 'en-US,en;q=0.9',
						'content-type': 'application/json',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-site',
						'sec-gpc': '1',
						'x-api-key': '2f6f419a083c46de9d83ce3dbe7db601',
						'x-build-id': 'hNScqXyRZeM9MrBNOg-iQ',
					},
					referrer: 'https://opensea.io/',
					referrerPolicy: 'strict-origin',
					body: JSON.stringify({ query: query.query, variables: { slugs: query.slugs, first: 100, after: query.cursor ?? '' } }),
					method: 'POST',
					mode: 'cors',
					credentials: 'omit',
				}).then((response) => response.json());
			},
			{ query, slugs, cursor },
		);
	}

	async getAssetsQuery(): Promise<string> {
		return `query searchAssetsQuery($slugs: [CollectionSlug!], $first: Int!, $after: String) {
      search(collections: $slugs, first: $first, sortBy: CREATED_DATE, sortAscending: true, resultType: ASSETS, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            asset {
              tokenId
              name
              imageUrl
              traits(first: 100) {
                edges {
                  node {
                    traitCount
                    traitType
                    value
                    floatValue
                    dateValue
                    displayType
                    maxValue
                    id
                    intValue
                    createdDate
                  }
                }
              }
            }
          }
        }
      }
    }`;
	}

	async test() {
		if (!this.BROWSER) {
			this.BROWSER = await puppeteer.launch({ headless: false, devtools: true });
		}

		const page = await this.BROWSER.newPage();
		await page.goto('https://opensea.io', {
			waitUntil: 'networkidle2',
		});

		const collections = await prisma.collections.findUnique({ where: { type: 'collections' } });
		if (!collections) return;

		const query = await this.getCollectionsQuery();

		const ez = async (query: string, slugs: string[]) => {
			return await page.evaluate(
				async (query) => {
					return fetch('https://api.opensea.io/graphql/', {
						headers: {
							accept: '*/*',
							'accept-language': 'en-US,en;q=0.9',
							'content-type': 'application/json',
							'sec-fetch-dest': 'empty',
							'sec-fetch-mode': 'cors',
							'sec-fetch-site': 'same-site',
							'sec-gpc': '1',
							'x-api-key': '2f6f419a083c46de9d83ce3dbe7db601',
							'x-build-id': 'hNScqXyRZeM9MrBNOg-iQ',
						},
						referrer: 'https://opensea.io/',
						referrerPolicy: 'strict-origin',
						body: JSON.stringify({ query: query.query, variables: { slugs: query.slugs, first: 100 } }),
						method: 'POST',
						mode: 'cors',
						credentials: 'omit',
					}).then((response) => response.json());
				},
				{ query, slugs },
			);
		};

		ez(query, collections.slugs).then(async (data) => {
			const collections = await prisma.collection.findMany({
				include: {
					attribute: true,
				},
			});

			const transactions: any = [];

			// const cryptopunks_attributes = [
			//   { id: 'Hair' },
			//   { id: 'Eyes' },
			//   { id: 'Facial Hair' },
			//   { id: 'Neck Accessory' },
			//   { id: 'Mouth Prop' },
			//   { id: 'Mouth' },
			//   { id: 'Blemishes' },
			//   { id: 'Ears' },
			//   { id: 'Nose' },
			// ];

			await Promise.all(
				data.data.collections.edges.map(async (x: any) => {
					const collectionId = collections?.find((c) => c.slug === x.node.slug);
					if (!collectionId) return;

					// Sort array attributes by alphabetical order
					const alphabeticalOrder = _.orderBy(x.node.stringTraits, [(trait) => trait.key.toLowerCase()], ['asc']);

					await Promise.all(
						alphabeticalOrder.map(async (a: any) => {
							const attributeUppercase = _.upperFirst(_.toLower(a.key));

							// Saving Attributes - Step 1
							// transactions.push(
							// 	prisma.attribute.upsert({
							// 		where: {
							// 			attributeId: `${x.node.slug}_${attributeUppercase}`,
							// 		},
							// 		update: {},
							// 		create: {
							// 			attributeId: `${x.node.slug}_${attributeUppercase}`,
							// 			attributeType: attributeUppercase,
							// 			collectionId: collectionId.id,
							// 		},
							// 	}),
							// );

							// Compare is the attributes are the same with uppercase since OpenSea provides lower and upper
							// Step 2

							const attrId = collectionId.attribute.find((attr) => attr.attributeType === attributeUppercase)?.id;
							let attrTotal = 0;

							await Promise.all(
								a.counts.map(async (trait: any) => {
									if (attrId) {
										attrTotal += trait.count;

										const traitId = `${x.node.slug}_${attributeUppercase}_${trait.value}`;

										transactions.push(
											prisma.trait.upsert({
												where: {
													traitId,
												},
												update: {},
												create: {
													traitId,
													traitType: trait.value,
													traitCount: trait.count,
													attributeId: attrId,
												},
											}),
										);
									}
								}),
							);

							if (attrId) {
								transactions.push(
									prisma.trait.upsert({
										where: {
											traitId: `${x.node.slug}_${attributeUppercase}_None`,
										},
										update: {},
										create: {
											traitId: `${x.node.slug}_${attributeUppercase}_None`,
											traitType: 'None',
											traitCount: x.node.stats.totalSupply - attrTotal,
											attributeId: attrId,
										},
									}),
								);
							}
						}),
					);

					transactions.push(
						prisma.attribute.upsert({
							where: { attributeId: `${x.node.slug}_Attributes` },
							update: {},
							create: {
								attributeId: `${x.node.slug}_Attributes`,
								attributeType: 'Attribute Count',
								attributeCount: 0,
								collectionId: collectionId.id,
							},
						}),
					);

					// await Promise.all(
					//   alphabeticalOrder.map(async (a: any) => {
					//     if (!collectionAttributes.hasOwnProperty(a.key)) {
					//       collectionAttributes[a.key] = attributeId;
					//       attributeId += 1;
					//     }

					//     const attrId = collectionId.attribute.find((attr) => attr.attributeType === a.key)?.id;
					//     let attrTotal = 0;

					//     await Promise.all(
					//       a.counts.map(async (trait: any) => {
					//         if (attrId) {
					//           attrTotal += trait.count;

					//           transactions.push(
					//             prisma.trait.upsert({
					//               where: {
					//                 traitId: `${x.node.slug}_${collectionAttributes[a.key]}_${trait.value}`,
					//               },
					//               update: {},
					//               create: {
					//                 traitId: `${x.node.slug}_${collectionAttributes[a.key]}_${trait.value}`,
					//                 traitType: trait.value,
					//                 traitCount: trait.count,
					//                 attributeId: attrId,
					//               },
					//             })
					//           );
					//         }
					//       })
					//     );

					//     console.log({
					//       traitId: `${x.node.slug}_${collectionAttributes[a.key]}_None`,
					//       traitType: 'None',
					//       traitCount: x.node.stats.totalSupply - attrTotal,
					//       attributeId: attrId,
					//     });

					//     // if (attrId) {
					//     //   transactions.push(
					//     //     prisma.trait.upsert({
					//     //       where: {
					//     //         traitId: `${x.node.slug}_${collectionAttributes[a.key]}_None`,
					//     //       },
					//     //       update: {},
					//     //       create: {
					//     //         traitId: `${x.node.slug}_${collectionAttributes[a.key]}_None`,
					//     //         traitType: 'None',
					//     //         traitCount: x.node.stats.totalSupply - attrTotal,
					//     //         attributeId: attrId,
					//     //       },
					//     //     })
					//     //   );
					//     // }

					//     // console.log(collectionTraitsIds);

					//     // if (!collectionTraits.hasOwnProperty(a.key)) {
					//     //   collectionTraits.push({
					//     //     id: traitId,
					//     //     traitType: a.key,
					//     //     traits: [],
					//     //   });

					//     //   traitId += 1;
					//     // }

					//     // await Promise.all(
					//     //   a.counts.map(async (trait: any) => {
					//     //     const attr = collectionTraits.find((ct) => ct.traitType === a.key);
					//     //     attr.traits.push(trait.value);
					//     //   })
					//     // );

					//     // await Promise.all(a.counts.map(async (trait: any) => {
					//     //   transactions.push(
					//     //     prisma.trait.upsert({
					//     //       where: {  }
					//     //     })
					//     //   )
					//     // }));

					//     // const attributeId = `${x.node.slug}_${collectionAttributes[a.key]}`;
					//     // const attributeData: { [key: string]: number } = {};

					//     // transactions.push(
					//     //   prisma.attribute.upsert({
					//     //     where: {
					//     //       attributeId,
					//     //     },
					//     //     update: {},
					//     //     create: {
					//     //       attributeId,
					//     //       attributeType: a.key,
					//     //       collectionId: collectionId.id,
					//     //     },
					//     //   })
					//     // );

					//     // await Promise.all(
					//     //   a.counts.map((s: any) => {
					//     //     attributeData[a.key] += s.count;
					//     //     collectionTraits.push({ attributeType: a.key, traitType: s.value, count: s.count });
					//     //   })
					//     // );
					//   })
					// );

					// await Promise.all(
					//   collectionTraits.map((t) => {
					//     for (const [key, value] of Object.entries(collectionAttributes)) {
					//       if (key === t.attributeType) {
					//         console.log({
					//           attributeType: key,
					//           attributeId: value,
					//           traitType: t.traitType,
					//           count: t.count,
					//         });
					//       }
					//     }
					//   })
					// );
				}),
			);

			const chunks = this.chunkArray(transactions, 250);
			for (const chunk of chunks) {
				console.log(chunk.length);
				await prisma.$transaction(chunk);
			}

			await this.BROWSER?.close();
			this.BROWSER = null;
		});
	}

	chunkArray(transactions: any[], chunkSize: number) {
		return Array.from({ length: Math.ceil(transactions.length / chunkSize) }, (_, i) => transactions.slice(i * chunkSize, (i + 1) * chunkSize));
	}

	async getCollections() {
		if (!this.BROWSER) {
			this.BROWSER = await puppeteer.launch({ headless: false });
		}

		const page = await this.BROWSER.newPage();

		const collections = await prisma.collections.findUnique({ where: { type: 'collections' } });
		if (!collections) {
			await this.BROWSER.close();
			this.BROWSER = null;
			return;
		}

		// const query = await this.getCollectionsQuery(collections.slugs ?? []);
		const query = ':sad';
		const response = await this.gqlRequest({ page, query, timeout: 2500 });

		console.log(response.success);
		console.log(response.data);

		if (!response.success) return;

		const traitIds: any = {};
		const traitCounts: any = {};
		let traitId = 0;

		await Promise.all(
			response.data.data.query.collections.edges.map(async (x: any) => {
				await Promise.all(
					x.node.stringTraits.map(async (t: any) => {
						if (!traitIds.hasOwnProperty(x.node.slug)) {
							traitIds[x.node.slug] = {
								id: traitId,
							};
						}

						// if (!traitIds.hasOwnProperty(t.key)) {
						//   traitIds[t.key] = traitId;
						//   traitId++;
						//   traitCounts[t.key] = 0;

						//   await Promise.all(
						//     t.counts.map((a: any) => {
						//       traitCounts[t.key] += a.count;
						//     })
						//   );
						// }
					}),
				);
			}),
		);

		await this.BROWSER.close();
		this.BROWSER = null;

		console.log(traitIds);
		console.log(traitCounts);
	}

	async sortCollections(data: any) {}

	async gqlRequest({ page, query, timeout }: { page: puppeteer.Page; query: string; timeout: number }) {
		return new Promise<{ success: boolean; data: any }>(async (resolve) => {
			await page.setRequestInterception(true);

			setTimeout(async () => {
				page.on('request', async (interceptedRequest) => {
					const postData = query;
					interceptedRequest.continue({
						method: 'GET',
						postData,
						headers: {
							'content-type': 'application/json',
							accept: 'application/json',
						},
					});
				});

				const response = await page.goto('https://api.opensea.io/graphql');
				if (response.status() === 200) {
					resolve({ success: true, data: JSON.parse(await response.text()) });
				} else {
					resolve({ success: false, data: null });
				}

				// await page.close();
			}, timeout ?? 1000);
		});
	}

	async getCollectionsQuery(): Promise<string> {
		return `query getCollections($slugs: [CollectionSlug!], $first: Int!) {
      collections(collections: $slugs, first: $first, sortBy: TOTAL_VOLUME) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            slug
            name
            description
            bannerImageUrl
            imageUrl
            largeImageUrl
            discordUrl
            externalUrl
            twitterUsername
            instagramUsername
            assetContracts(first: 1) {
              edges {
                node {
                  address
                }
              }
            }
            stringTraits {
              key
              counts {
                value
                count
              }
            }
            stats {
              oneDayVolume
              oneDayChange
              oneDaySales
              oneDayAveragePrice
              sevenDayVolume
              sevenDayChange
              sevenDaySales
              sevenDayAveragePrice
              thirtyDayVolume
              thirtyDayChange
              thirtyDaySales
              thirtyDayAveragePrice
              totalVolume
              totalSales
              totalSupply
              numOwners
              averagePrice
              numReports
              marketCap 
              floorPrice
            }
          }
        }
      }
    }`;
	}
}

const api = new OpenSea();
export default api;

// import puppeteer from 'puppeteer';

// import prisma from '@root/utils/lib/prisma';

// class OpenSea {
//   API_INTERVAL: number;
//   COLLECTION_BROWSER: puppeteer.Browser | null;
//   COLLECTION_PAGE: puppeteer.Page | null;
//   ASSETS_BROWSER: puppeteer.Browser | null;
//   ASSETS_PAGE: puppeteer.Page | null;

//   constructor() {
//     this.API_INTERVAL = 2500;
//     this.COLLECTION_BROWSER = null;
//     this.COLLECTION_PAGE = null;
//     this.ASSETS_BROWSER = null;
//     this.ASSETS_PAGE = null;
//   }

//   async test() {
//     this.ASSETS_BROWSER = await puppeteer.launch({ headless: false });
//     this.ASSETS_PAGE = await this.ASSETS_BROWSER.newPage();

//     await this.ASSETS_PAGE.setExtraHTTPHeaders({
//       'content-type': 'application/graphql',
//     });

//     await this.ASSETS_PAGE.goto(
//       'https://api.opensea.io/graphql/?query=%7Bquery%20%7B%20search(collections:%20[%22cryptopunks%22],%20first:%20100,%20sortBy:%20CREATED_DATE,%20after:%20%22%22)%20%7B%20pageInfo%20%7B%20hasNextPage%20hasPreviousPage%20startCursor%20endCursor%20%7D%20edges%20%7B%20node%20%7B%20asset%20%7B%20tokenId%20name%20imageUrl%20traits(first:%20100)%20%7B%20edges%20%7B%20node%20%7B%20traitCount%20traitType%20value%20floatValue%20dateValue%20displayType%20maxValue%20id%20intValue%20createdDate%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%20%7D%7D'
//     );
//   }

//   async getAllAssets(slug: string, supply: number) {
//     if (!slug) throw new Error('Invalid Slug');
//     if (!supply) throw new Error('Invalid Supply');

//     if (!this.ASSETS_BROWSER && !this.ASSETS_PAGE) {
//       this.ASSETS_BROWSER = await puppeteer.launch({ headless: false });
//     }

//     const pages: number = Math.ceil(supply / 100);
//     let page: number = 1;
//     let cursor: string | null = null;

//     const collection = await prisma.collection.findUnique({
//       where: { slug },
//       select: {
//         id: true,
//         slug: true,
//         Trait: {
//           select: {
//             id: true,
//             traitType: true,
//             traitCount: true,
//             value: true,
//           },
//         },
//       },
//     });

//     if (!collection) throw new Error('No collection found with that slug');

//     const transactions: any[] = [];

//     while (page <= pages) {
//       const query: string = await this.searchAssetsQuery(slug, cursor);
//       const response: { success: boolean; data: any } = await this.sendGqlRequest(this.ASSETS_BROWSER, query, 10250);

//       if (response.success) {
//         cursor = response.data.data.query.search.pageInfo.hasNextPage === true ? response.data.data.query.search.pageInfo.endCursor : null;

//         console.log(`Page: ${page}`);

//         await Promise.all(
//           response.data.data.query.search.edges.map(async (a: any) => {
//             if (a.node.asset !== null) {
//               // transactions.push(
//               //   prisma.asset.upsert({
//               //     where: { assetSlug: `${collection.slug}:${a.node.asset.tokenId}` },
//               //     update: {},
//               //     create: {
//               //       assetSlug: `${collection.slug}:${a.node.asset.tokenId}`,
//               //       tokenId: a.node.asset.tokenId,
//               //       name: a.node.asset.name,
//               //       imageUrl: a.node.asset.imageUrl,
//               //       collectionId: collection.id,
//               //       rarityScore: 1,
//               //       traitIDs: collection.Trait.filter((t) => {
//               //         return a.node.asset.traits.edges.find((a: any) => a.node.traitType === t.traitType && a.node.value === t.value);
//               //       }).map((x) => x.id),
//               //     },
//               //   })
//               // );
//             }
//           })
//         );

//         page += 1;
//       }
//     }

//     await this.closeAssets();

//     const chunks = this.chunkArray(transactions, 250);
//     for (const chunk of chunks) {
//       console.log(chunk.length);
//       await prisma.$transaction(chunk);
//     }
//   }

//   async getAllCollections() {
//     if (!this.COLLECTION_BROWSER && !this.COLLECTION_PAGE) {
//       this.COLLECTION_BROWSER = await puppeteer.launch({ headless: false });
//       this.COLLECTION_PAGE = await this.COLLECTION_BROWSER.newPage();
//       this.COLLECTION_PAGE.setRequestInterception(true);
//     }

//     const collections = await prisma.collections.findUnique({ where: { type: 'collections' } });
//     if (!collections) {
//       await this.closeCollection();
//       return;
//     }

//     const query = await this.getCollectionsQuery(collections?.slugs ?? []);
//     const response = await this.sendGqlRequest(this.COLLECTION_BROWSER, query);

//     if (response.success) {
//       const attributeTransactions: any[] = [];
//       const missingAttributeTransactions: any[] = [];

//       await Promise.all(
//         response.data.data.query.collections.edges.map(async (c: any) => {
//           const data = {
//             slug: c.node.slug,
//             contractAddress: c.node.assetContracts.edges[0].node.address ?? '',
//             name: c.node.name,
//             description: c.node.description,
//             bannerImageUrl: c.node.bannerImageUrl,
//             imageUrl: c.node.imageUrl,
//             largeImageUrl: c.node.largeImageUrl,
//             discordUrl: c.node.discordUrl,
//             externalUrl: c.node.externalUrl,
//             twitterUsername: c.node.twitterUsername,
//             instagramUsername: c.node.instagramUsername,
//             oneDayVolume: c.node.stats.oneDayVolume,
//             oneDayChange: c.node.stats.oneDayChange,
//             oneDaySales: c.node.stats.oneDaySales,
//             oneDayAveragePrice: c.node.stats.oneDayAveragePrice,
//             sevenDayVolume: c.node.stats.sevenDayVolume,
//             sevenDayChange: c.node.stats.sevenDayChange,
//             sevenDaySales: c.node.stats.sevenDaySales,
//             sevenDayAveragePrice: c.node.stats.sevenDayAveragePrice,
//             thirtyDayVolume: c.node.stats.thirtyDayVolume,
//             thirtyDayChange: c.node.stats.thirtyDayChange,
//             thirtyDaySales: c.node.stats.thirtyDaySales,
//             thirtyDayAveragePrice: c.node.stats.thirtyDayAveragePrice,
//             totalVolume: c.node.stats.totalVolume,
//             totalSales: c.node.stats.totalSales,
//             totalSupply: c.node.stats.totalSupply,
//             numOwners: c.node.stats.numOwners,
//             averagePrice: c.node.stats.averagePrice,
//             numReports: c.node.stats.numReports,
//             marketCap: c.node.stats.marketCap,
//             floorPrice: c.node.stats.floorPrice,
//           };

//           const collection = await prisma.collection.upsert({
//             where: { slug: c.node.slug },
//             update: data,
//             create: data,
//           });

//           await Promise.all(
//             c.node.stringTraits.map(async (st: any) => {
//               let traitCount = 0;

//               await Promise.all(
//                 st.counts.map(async (t: { value: string; count: number }) => {
//                   if (collection) {
//                     traitCount += t.count;

//                     // Create an attribute and missing attribute
//                     const slug = `${c.node.slug}:${st.key}:${t.value}`;

//                     const attrPercentile = t.count / collection.totalSupply;
//                     const attrRarityScore = 1 / (t.count / collection.totalSupply);

//                     // const missSupply = collection.totalSupply - t.count;
//                     // const missPercentile = missSupply / collection.totalSupply;
//                     // const missRarityScore = 1 / (missSupply / collection.totalSupply);

//                     attributeTransactions.push(
//                       prisma.attribute.upsert({
//                         where: {
//                           slug,
//                         },
//                         update: {
//                           traitCount: t.count,
//                           percentile: attrPercentile,
//                           rarityScore: attrRarityScore,
//                         },
//                         create: {
//                           slug,
//                           traitType: st.key,
//                           traitCount: t.count,
//                           value: t.value,
//                           collectionId: collection.id,
//                           percentile: attrPercentile,
//                           rarityScore: attrRarityScore,
//                         },
//                       })
//                     );

//                     // const percentile = t.count / collection.totalSupply;
//                     // const rarityScore = 1 / (t.count / collection.totalSupply);

//                     // transactions.push(
//                     //   prisma.trait.upsert({
//                     //     where: { slug: `${c.node.slug}:${st.key}:${t.value}` },
//                     //     update: {
//                     //       traitCount: t.count,
//                     //     },
//                     //     create: {
//                     //       slug: `${c.node.slug}:${st.key}:${t.value}`,
//                     //       traitType: st.key,
//                     //       traitCount: t.count,
//                     //       value: t.value,
//                     //       collectionId: collection.id,
//                     //       percentile,
//                     //       rarityScore,
//                     //     },
//                     //   })
//                     // );
//                   }
//                 })
//               );

//               const at = collection.totalSupply - traitCount;
//               const atPercentile = at / collection.totalSupply;
//               const atRarityScore = 1 / (at / collection.totalSupply) ?? 1;

//               if (at < 0) {
//                 console.log({
//                   slug: c.node.slug,
//                   key: st.key,
//                   at,
//                 });
//               }

//               attributeTransactions.push(
//                 prisma.attribute.upsert({
//                   where: {
//                     slug: `${c.node.slug}:${st.key}:None`,
//                   },
//                   update: {},
//                   create: {
//                     slug: `${c.node.slug}:${st.key}:None`,
//                     traitType: st.key,
//                     traitCount: at,
//                     value: 'None',
//                     percentile: atPercentile,
//                     rarityScore: atRarityScore,
//                     collectionId: collection.id,
//                   },
//                 })
//               );
//             })
//           );
//         })
//       );

//       await this.closeCollection();

//       console.log(attributeTransactions.length);
//       console.log(missingAttributeTransactions.length);

//       const aChunks = this.chunkArray(attributeTransactions, 500);
//       for (const chunk of aChunks) {
//         console.log(`a ${chunk.length}`);
//         await prisma.$transaction(chunk);
//       }
//     }
//   }

//   chunkArray(transactions: any[], chunkSize: number) {
//     return Array.from({ length: Math.ceil(transactions.length / chunkSize) }, (_, i) => transactions.slice(i * chunkSize, (i + 1) * chunkSize));
//   }

//   async sendGqlRequest(browser: puppeteer.Browser | null, query: string, timeout?: number): Promise<{ success: boolean; data: any }> {
//     return new Promise<{ success: boolean; data: any }>(async (resolve) => {
//       const page = await browser?.newPage();
//       await page?.setRequestInterception(true);

//       setTimeout(async () => {
//         page?.on('request', async (interceptedRequest) => {
//           const postData = query;
//           interceptedRequest.continue({ method: 'GET', postData, headers: { 'content-type': 'application/graphql' } });
//         });

//         const response = await page?.goto('https://api.opensea.io/graphql');
//         if (response?.status() === 200) {
//           resolve({ success: true, data: JSON.parse(await response.text()) });
//         } else {
//           resolve({ success: false, data: null });
//         }

//         await page?.close();
//       }, timeout ?? 100);
//     });
//   }

//   async searchAssetsQuery(slug: string, cursor: string | null): Promise<string> {
//     return `{query { search(collections: ["${slug}"], first: 100, sortBy: CREATED_DATE, after: "${cursor ?? ''}") {
// 			pageInfo {
// 				hasNextPage
// 				hasPreviousPage
// 				startCursor
// 				endCursor
// 			}
// 			edges {
// 				node {
// 					asset {
// 						tokenId
// 						name
// 						imageUrl
// 						traits(first: 100) {
// 							edges {
// 								node {
// 									traitCount
// 									traitType
// 									value
// 									floatValue
// 									dateValue
// 									displayType
// 									maxValue
// 									id
// 									intValue
// 									createdDate
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 		} }}`;
//   }

//   async getCollectionsQuery(slugs: string[]): Promise<string> {
//     return `{query { collections(collections: [${slugs.map((s) => `"${s}"`)}], first: ${
//       slugs.length
//     }, sortBy: TOTAL_VOLUME) { pageInfo { startCursor endCursor } edges { node { slug name description bannerImageUrl imageUrl largeImageUrl discordUrl externalUrl twitterUsername instagramUsername assetContracts(first: 1) { edges { node { address } } } stringTraits { key counts { value count } } stats { oneDayVolume oneDayChange oneDaySales oneDayAveragePrice sevenDayVolume sevenDayChange sevenDaySales sevenDayAveragePrice thirtyDayVolume thirtyDayChange thirtyDaySales thirtyDayAveragePrice totalVolume totalSales totalSupply numOwners averagePrice numReports marketCap floorPrice } } } } }}`;
//   }

//   async closeCollection(): Promise<boolean> {
//     await this.COLLECTION_BROWSER?.close();
//     this.COLLECTION_BROWSER = null;
//     this.COLLECTION_PAGE = null;
//     return true;
//   }

//   async closeAssets(): Promise<boolean> {
//     await this.ASSETS_BROWSER?.close();
//     this.ASSETS_BROWSER = null;
//     this.ASSETS_PAGE = null;
//     return true;
//   }
// }

// const api = new OpenSea();
// export default api;
