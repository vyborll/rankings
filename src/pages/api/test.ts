import opensea from '@root/utils/lib/opensea';
import { ObjectId } from 'bson';

import prisma from '@root/utils/lib/prisma';

export default async function handler(req: any, res: any) {
  // const collection = await prisma.collection.findUnique({
  // 	where: { slug: 'cryptopunks' },
  // 	include: {
  // 		Trait: true,
  // 	},
  // });

  // const data = {
  // 	data: {
  // 		query: {
  // 			search: {
  // 				pageInfo: {
  // 					hasNextPage: true,
  // 					hasPreviousPage: false,
  // 					startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
  // 					endCursor: 'YXJyYXljb25uZWN0aW9uOjk=',
  // 				},
  // 				edges: [
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9994',
  // 								name: 'CryptoPunk #9994',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/I5rFdPt-FPsGsjF7oaoPGhdLq22jW6JCOTMUB5yvdF7JK9xdUQZxZp1_fwlZGApBjEploJXkr_k4b0nc_hWDeEqqrQ',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 129,
  // 												traitType: 'accessory',
  // 												value: 'Blonde Short',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4MA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.865163',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 271,
  // 												traitType: 'accessory',
  // 												value: 'Green Eye Shadow',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.834790',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 3840,
  // 												traitType: 'type',
  // 												value: 'Female',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.811765',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9993',
  // 								name: 'CryptoPunk #9993',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/35f2N6uqMiehSGuJHBKzzkEYvosWtoBqNZnCs_kUkCdFnTwUa_zCEhEGb9iw4IZZW4Io0G9a0xiUEpEjxrRyM4iF',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 572,
  // 												traitType: 'accessory',
  // 												value: 'Nerd Glasses',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4Mw==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:20.600992',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 526,
  // 												traitType: 'accessory',
  // 												value: 'Shadow Beard',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4Mg==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:20.580103',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 351,
  // 												traitType: 'accessory',
  // 												value: 'Cap',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4MQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:20.563282',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 6039,
  // 												traitType: 'type',
  // 												value: 'Male',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:17:02.271156',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9990',
  // 								name: 'CryptoPunk #9990',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/WFNfsVSglNvISamUl-r9MyhC5eHwUdh2xUoA1hZc0X2Uon2Z_x_qUCTmCQF9ohYJU8OwcICoocNOWfjiDleMK_aMAQ',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 441,
  // 												traitType: 'accessory',
  // 												value: 'Mohawk',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:22.175757',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 535,
  // 												traitType: 'accessory',
  // 												value: 'Horned Rim Glasses',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4NA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:22.150717',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 6039,
  // 												traitType: 'type',
  // 												value: 'Male',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:17:02.271156',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9988',
  // 								name: 'CryptoPunk #9988',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/i29KCq-Q8GzZedw0fVAj9afWE01q3S6ACPlt1kVE_I1N5r4SHJYJIi5MAtAkrSGMKCkxJ5TbnDjY6iYp7YaasnYWMg',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 169,
  // 												traitType: 'accessory',
  // 												value: 'Gold Chain',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4Nw==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:23.825321',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 460,
  // 												traitType: 'accessory',
  // 												value: 'Messy Hair',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4Ng==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:23.797012',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 6039,
  // 												traitType: 'type',
  // 												value: 'Male',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:17:02.271156',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9985',
  // 								name: 'CryptoPunk #9985',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/blCdXnzxaCuS7yb_HEWLzMONSr3UJ0CKccY9RUZOaNjFgKUZinBngymuqLuXGBb1IZx8j-4217QMkVusuXHN86c',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 146,
  // 												traitType: 'accessory',
  // 												value: 'Big Beard',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4OQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:25.299074',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 147,
  // 												traitType: 'accessory',
  // 												value: 'Vampire Hair',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:25.262020',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 6039,
  // 												traitType: 'type',
  // 												value: 'Male',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:17:02.271156',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9986',
  // 								name: 'CryptoPunk #9986',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/Z9MVgu5G5KCSlenX8NkNfns6saiZHdxhd3_qA4fJ4vQr5wHpsycVksJH0yVJ9y9YP0fcVFxq3ojtCK3wJnqblBxhu3deVW3L01g6Jg',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 303,
  // 												traitType: 'accessory',
  // 												value: 'Muttonchops',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5MA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:26.726487',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 441,
  // 												traitType: 'accessory',
  // 												value: 'Mohawk',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:22.175757',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 6039,
  // 												traitType: 'type',
  // 												value: 'Male',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:17:02.271156',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9983',
  // 								name: 'CryptoPunk #9983',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/NCba_Fa98S0ZVotSim7cIEeOoTGOuCiOBJ-LJrI1ptk9sj4wgc2pDfjo99qOFPf_4LDD9Mtt-NA1A_HO2jgOQUGO_rGTZLBCic6yGg',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 655,
  // 												traitType: 'accessory',
  // 												value: 'Purple Lipstick',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5Mw==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:28.167115',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 502,
  // 												traitType: 'accessory',
  // 												value: 'Classic Shades',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5Mg==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:28.141611',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 644,
  // 												traitType: 'accessory',
  // 												value: 'Mole',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5MQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:28.114809',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 3840,
  // 												traitType: 'type',
  // 												value: 'Female',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.811765',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9980',
  // 								name: 'CryptoPunk #9980',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/jq7D4xa5Kj8WGFWo1m5LosBWnaATpi7eEoZIg0nQyLL1AtEBtZo-OART4_Ia_33t4Eb9WjnCQZyZndW7xLX1yNVyq1BMIp54dfw1pwk',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 961,
  // 												traitType: 'accessory',
  // 												value: 'Cigarette',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5NQ==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:29.719038',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 617,
  // 												traitType: 'accessory',
  // 												value: 'Black Lipstick',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5NA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:29.663099',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 502,
  // 												traitType: 'accessory',
  // 												value: 'Classic Shades',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5Mg==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:28.141611',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 129,
  // 												traitType: 'accessory',
  // 												value: 'Blonde Short',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4MA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.865163',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 3840,
  // 												traitType: 'type',
  // 												value: 'Female',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.811765',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9982',
  // 								name: 'CryptoPunk #9982',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/nWDLdXvsA-sCfUvicN11nLHo-0ND-T4h-mUcGvg61R9w-AeEFrKPWr6In1RlF6kbT3w1cDqp8DnBdkAgZnDw4iw',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 2459,
  // 												traitType: 'accessory',
  // 												value: 'Earring',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:31.242985',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 332,
  // 												traitType: 'accessory',
  // 												value: 'VR',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5Nw==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:31.207062',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 463,
  // 												traitType: 'accessory',
  // 												value: 'Stringy Hair',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5Ng==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:31.174295',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 3840,
  // 												traitType: 'type',
  // 												value: 'Female',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.811765',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 					{
  // 						node: {
  // 							asset: {
  // 								tokenId: '9981',
  // 								name: 'CryptoPunk #9981',
  // 								imageUrl:
  // 									'https://lh3.googleusercontent.com/UvO1dp-AN1WCaBbxfpx24tPaWXd9SBicNpTiYZb7Xi8pw6tcgPk7dAMdYHwzLZYnedmxoaEn0TLEo0jqM7KBb_Am',
  // 								traits: {
  // 									edges: [
  // 										{
  // 											node: {
  // 												traitCount: 2459,
  // 												traitType: 'accessory',
  // 												value: 'Earring',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:31.242985',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 617,
  // 												traitType: 'accessory',
  // 												value: 'Black Lipstick',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg5NA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:29.663099',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 572,
  // 												traitType: 'accessory',
  // 												value: 'Nerd Glasses',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg4Mw==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:20.600992',
  // 											},
  // 										},
  // 										{
  // 											node: {
  // 												traitCount: 3840,
  // 												traitType: 'type',
  // 												value: 'Female',
  // 												floatValue: null,
  // 												dateValue: null,
  // 												displayType: null,
  // 												maxValue: null,
  // 												id: 'VHJhaXRUeXBlOjQ4ODg3OA==',
  // 												intValue: null,
  // 												createdDate: '2019-07-24T03:18:18.811765',
  // 											},
  // 										},
  // 									],
  // 								},
  // 							},
  // 						},
  // 					},
  // 				],
  // 			},
  // 		},
  // 	},
  // };

  // await Promise.all(
  // 	data.data.query.search.edges.map(async (a) => {
  // 		await Promise.all(
  // 			a.node.asset.traits.edges.map((t) => {
  // 				console.log({
  // 					tokenId: a.node.asset.tokenId,
  // 					name: a.node.asset.name,
  // 					traitSlug: `cryptopunks:${t.node.traitType}:${t.node.value}`,
  // 				});
  // 			}),
  // 		);
  // 	}),
  // );

  // const asset = await prisma.asset.create({
  // 	data: {
  // 		name: 'test',
  // 		tokenId: '12',
  // 		assetSlug: 'cryptopunks:123',
  // 		imageUrl: '12',
  // 		collectionId: '614e8c3c0021c2f5009317ee',
  // 		traitIDs: ['614f8caf0058359200bcff72', '614f8caf0058359200bcff71'],
  // 	},
  // });

  // const asset = await prisma.asset.findUnique({
  // 	where: { assetSlug: 'cryptopunks:123' },
  // 	select: {
  // 		name: true,
  // 		traits: {
  // 			select: {
  // 				traitType: true,
  // 				traitCount: true,
  // 				value: true,
  // 			},
  // 		},
  // 	},
  // });

  const collection = await prisma.collection.findUnique({
    where: { slug: 'cryptopunks' },
    select: {
      name: true,
      description: true,
      Trait: {
        select: {
          id: true,
          traitType: true,
          traitCount: true,
          value: true,
        },
      },
    },
  });

  const traits = {
    name: 'CryptoPunks',
    description:
      'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.',
    Trait: [
      {
        id: '614f8caf0058359200bcff6e',
        traitType: 'accessory',
        traitCount: 254,
        value: 'Cap Forward',
      },
      {
        id: '614f8caf0058359200bcff6f',
        traitType: 'accessory',
        traitCount: 124,
        value: 'Spots',
      },
      {
        id: '614f8caf0058359200bcff70',
        traitType: 'accessory',
        traitCount: 502,
        value: 'Classic Shades',
      },
      {
        id: '614f8caf0058359200bcff71',
        traitType: 'accessory',
        traitCount: 461,
        value: 'Eye Patch',
      },
      {
        id: '614f8caf0058359200bcff72',
        traitType: 'accessory',
        traitCount: 128,
        value: 'Rosy Cheeks',
      },
      {
        id: '614f8caf0058359200bcff73',
        traitType: 'accessory',
        traitCount: 429,
        value: 'Mohawk Dark',
      },
      {
        id: '614f8caf0058359200bcff74',
        traitType: 'accessory',
        traitCount: 384,
        value: 'Clown Eyes Blue',
      },
      {
        id: '614f8caf0058359200bcff75',
        traitType: 'accessory',
        traitCount: 460,
        value: 'Messy Hair',
      },
      {
        id: '614f8cb00058359200bcff76',
        traitType: 'accessory',
        traitCount: 169,
        value: 'Gold Chain',
      },
      {
        id: '614f8cb00058359200bcff77',
        traitType: 'accessory',
        traitCount: 317,
        value: 'Pipe',
      },
      {
        id: '614f8cb00058359200bcff78',
        traitType: 'accessory',
        traitCount: 441,
        value: 'Mohawk',
      },
      {
        id: '614f8cb00058359200bcff79',
        traitType: 'accessory',
        traitCount: 95,
        value: 'Pink With Hat',
      },
      {
        id: '614f8cb00058359200bcff7a',
        traitType: 'accessory',
        traitCount: 382,
        value: 'Clown Eyes Green',
      },
      {
        id: '614f8cb00058359200bcff7b',
        traitType: 'accessory',
        traitCount: 644,
        value: 'Mole',
      },
      {
        id: '614f8cb00058359200bcff7c',
        traitType: 'accessory',
        traitCount: 260,
        value: 'Front Beard Dark',
      },
      {
        id: '614f8cb00058359200bcff7d',
        traitType: 'accessory',
        traitCount: 655,
        value: 'Purple Lipstick',
      },
      {
        id: '614f8cb00058359200bcff7e',
        traitType: 'accessory',
        traitCount: 238,
        value: 'Smile',
      },
      {
        id: '614f8cb00058359200bcff7f',
        traitType: 'accessory',
        traitCount: 303,
        value: 'Peak Spike',
      },
      {
        id: '614f8cb00058359200bcff80',
        traitType: 'accessory',
        traitCount: 300,
        value: 'Shaved Head',
      },
      {
        id: '614f8cb00058359200bcff81',
        traitType: 'accessory',
        traitCount: 178,
        value: 'Tassle Hat',
      },
      {
        id: '614f8cb00058359200bcff82',
        traitType: 'accessory',
        traitCount: 535,
        value: 'Horned Rim Glasses',
      },
      {
        id: '614f8cb00058359200bcff83',
        traitType: 'accessory',
        traitCount: 144,
        value: 'Straight Hair Blonde',
      },
      {
        id: '614f8cb00058359200bcff84',
        traitType: 'accessory',
        traitCount: 414,
        value: 'Crazy Hair',
      },
      {
        id: '614f8cb00058359200bcff85',
        traitType: 'accessory',
        traitCount: 263,
        value: 'Handlebars',
      },
      {
        id: '614f8cb00058359200bcff86',
        traitType: 'accessory',
        traitCount: 129,
        value: 'Blonde Short',
      },
      {
        id: '614f8cb00058359200bcff87',
        traitType: 'accessory',
        traitCount: 86,
        value: 'Welding Goggles',
      },
      {
        id: '614f8cb00058359200bcff88',
        traitType: 'accessory',
        traitCount: 378,
        value: 'Small Shades',
      },
      {
        id: '614f8cb00058359200bcff89',
        traitType: 'accessory',
        traitCount: 48,
        value: 'Choker',
      },
      {
        id: '614f8cb00058359200bcff8a',
        traitType: 'accessory',
        traitCount: 293,
        value: 'Eye Mask',
      },
      {
        id: '614f8cb00058359200bcff8b',
        traitType: 'accessory',
        traitCount: 463,
        value: 'Stringy Hair',
      },
      {
        id: '614f8cb10058359200bcff8c',
        traitType: 'accessory',
        traitCount: 175,
        value: 'Medical Mask',
      },
      {
        id: '614f8cb10058359200bcff8d',
        traitType: 'accessory',
        traitCount: 266,
        value: 'Blue Eye Shadow',
      },
      {
        id: '614f8cb10058359200bcff8e',
        traitType: 'accessory',
        traitCount: 136,
        value: 'Wild White Hair',
      },
      {
        id: '614f8cb10058359200bcff8f',
        traitType: 'accessory',
        traitCount: 288,
        value: 'Mustache',
      },
      {
        id: '614f8cb10058359200bcff90',
        traitType: 'accessory',
        traitCount: 2459,
        value: 'Earring',
      },
      {
        id: '614f8cb10058359200bcff91',
        traitType: 'accessory',
        traitCount: 147,
        value: 'Vampire Hair',
      },
      {
        id: '614f8cb10058359200bcff92',
        traitType: 'accessory',
        traitCount: 442,
        value: 'Frumpy Hair',
      },
      {
        id: '614f8cb10058359200bcff93',
        traitType: 'accessory',
        traitCount: 289,
        value: 'Normal Beard Black',
      },
      {
        id: '614f8cb10058359200bcff94',
        traitType: 'accessory',
        traitCount: 78,
        value: 'Buck Teeth',
      },
      {
        id: '614f8cb10058359200bcff95',
        traitType: 'accessory',
        traitCount: 696,
        value: 'Hot Lipstick',
      },
      {
        id: '614f8cb10058359200bcff96',
        traitType: 'accessory',
        traitCount: 572,
        value: 'Nerd Glasses',
      },
      {
        id: '614f8cb10058359200bcff97',
        traitType: 'accessory',
        traitCount: 292,
        value: 'Normal Beard',
      },
      {
        id: '614f8cb10058359200bcff98',
        traitType: 'accessory',
        traitCount: 273,
        value: 'Front Beard',
      },
      {
        id: '614f8cb10058359200bcff99',
        traitType: 'accessory',
        traitCount: 526,
        value: 'Shadow Beard',
      },
      {
        id: '614f8cb10058359200bcff9a',
        traitType: 'accessory',
        traitCount: 144,
        value: 'Wild Blonde',
      },
      {
        id: '614f8cb10058359200bcff9b',
        traitType: 'accessory',
        traitCount: 961,
        value: 'Cigarette',
      },
      {
        id: '614f8cb10058359200bcff9c',
        traitType: 'accessory',
        traitCount: 535,
        value: 'Big Shades',
      },
      {
        id: '614f8cb10058359200bcff9d',
        traitType: 'accessory',
        traitCount: 142,
        value: 'Cowboy Hat',
      },
      {
        id: '614f8cb10058359200bcff9e',
        traitType: 'accessory',
        traitCount: 147,
        value: 'Half Shaved',
      },
      {
        id: '614f8cb10058359200bcff9f',
        traitType: 'accessory',
        traitCount: 286,
        value: 'Luxurious Beard',
      },
      {
        id: '614f8cb10058359200bcffa0',
        traitType: 'accessory',
        traitCount: 212,
        value: 'Clown Nose',
      },
      {
        id: '614f8cb20058359200bcffa1',
        traitType: 'accessory',
        traitCount: 148,
        value: 'Straight Hair Dark',
      },
      {
        id: '614f8cb20058359200bcffa2',
        traitType: 'accessory',
        traitCount: 44,
        value: 'Beanie',
      },
      {
        id: '614f8cb20058359200bcffa3',
        traitType: 'accessory',
        traitCount: 406,
        value: 'Headband',
      },
      {
        id: '614f8cb20058359200bcffa4',
        traitType: 'accessory',
        traitCount: 165,
        value: 'Purple Hair',
      },
      {
        id: '614f8cb20058359200bcffa5',
        traitType: 'accessory',
        traitCount: 447,
        value: 'Wild Hair',
      },
      {
        id: '614f8cb20058359200bcffa6',
        traitType: 'accessory',
        traitCount: 115,
        value: 'Top Hat',
      },
      {
        id: '614f8cb20058359200bcffa7',
        traitType: 'accessory',
        traitCount: 419,
        value: 'Knitted Cap',
      },
      {
        id: '614f8cb20058359200bcffa8',
        traitType: 'accessory',
        traitCount: 156,
        value: 'Silver Chain',
      },
      {
        id: '614f8cb20058359200bcffa9',
        traitType: 'accessory',
        traitCount: 203,
        value: 'Police Cap',
      },
      {
        id: '614f8cb20058359200bcffaa',
        traitType: 'accessory',
        traitCount: 332,
        value: 'VR',
      },
      {
        id: '614f8cb20058359200bcffab',
        traitType: 'accessory',
        traitCount: 271,
        value: 'Green Eye Shadow',
      },
      {
        id: '614f8cb20058359200bcffac',
        traitType: 'accessory',
        traitCount: 272,
        value: 'Vape',
      },
      {
        id: '614f8cb20058359200bcffad',
        traitType: 'accessory',
        traitCount: 286,
        value: '3D Glasses',
      },
      {
        id: '614f8cb20058359200bcffae',
        traitType: 'accessory',
        traitCount: 54,
        value: 'Pilot Helmet',
      },
      {
        id: '614f8cb20058359200bcffaf',
        traitType: 'accessory',
        traitCount: 441,
        value: 'Mohawk Thin',
      },
      {
        id: '614f8cb20058359200bcffb0',
        traitType: 'accessory',
        traitCount: 300,
        value: 'Do-rag',
      },
      {
        id: '614f8cb20058359200bcffb1',
        traitType: 'accessory',
        traitCount: 157,
        value: 'Dark Hair',
      },
      {
        id: '614f8cb20058359200bcffb2',
        traitType: 'accessory',
        traitCount: 262,
        value: 'Purple Eye Shadow',
      },
      {
        id: '614f8cb30058359200bcffb3',
        traitType: 'accessory',
        traitCount: 151,
        value: 'Straight Hair',
      },
      {
        id: '614f8cb30058359200bcffb4',
        traitType: 'accessory',
        traitCount: 147,
        value: 'Red Mohawk',
      },
      {
        id: '614f8cb30058359200bcffb5',
        traitType: 'accessory',
        traitCount: 527,
        value: 'Regular Shades',
      },
      {
        id: '614f8cb30058359200bcffb6',
        traitType: 'accessory',
        traitCount: 259,
        value: 'Hoodie',
      },
      {
        id: '614f8cb30058359200bcffb7',
        traitType: 'accessory',
        traitCount: 351,
        value: 'Cap',
      },
      {
        id: '614f8cb30058359200bcffb8',
        traitType: 'accessory',
        traitCount: 481,
        value: 'Bandana',
      },
      {
        id: '614f8cb30058359200bcffb9',
        traitType: 'accessory',
        traitCount: 617,
        value: 'Black Lipstick',
      },
      {
        id: '614f8cb30058359200bcffba',
        traitType: 'accessory',
        traitCount: 148,
        value: 'Clown Hair Green',
      },
      {
        id: '614f8cb30058359200bcffbb',
        traitType: 'accessory',
        traitCount: 261,
        value: 'Frown',
      },
      {
        id: '614f8cb30058359200bcffbc',
        traitType: 'accessory',
        traitCount: 186,
        value: 'Fedora',
      },
      {
        id: '614f8cb30058359200bcffbd',
        traitType: 'accessory',
        traitCount: 94,
        value: 'Pigtails',
      },
      {
        id: '614f8cb30058359200bcffbe',
        traitType: 'accessory',
        traitCount: 55,
        value: 'Tiara',
      },
      {
        id: '614f8cb30058359200bcffbf',
        traitType: 'accessory',
        traitCount: 282,
        value: 'Chinstrap',
      },
      {
        id: '614f8cb30058359200bcffc0',
        traitType: 'accessory',
        traitCount: 147,
        value: 'Blonde Bob',
      },
      {
        id: '614f8cb40058359200bcffc1',
        traitType: 'accessory',
        traitCount: 146,
        value: 'Big Beard',
      },
      {
        id: '614f8cb40058359200bcffc2',
        traitType: 'accessory',
        traitCount: 295,
        value: 'Goat',
      },
      {
        id: '614f8cb40058359200bcffc3',
        traitType: 'accessory',
        traitCount: 68,
        value: 'Orange Side',
      },
      {
        id: '614f8cb40058359200bcffc4',
        traitType: 'accessory',
        traitCount: 303,
        value: 'Muttonchops',
      },
      {
        id: '614f8cb40058359200bcffc5',
        traitType: 'type',
        traitCount: 88,
        value: 'Zombie',
      },
      {
        id: '614f8cb40058359200bcffc6',
        traitType: 'type',
        traitCount: 9,
        value: 'Alien',
      },
      {
        id: '614f8cb40058359200bcffc7',
        traitType: 'type',
        traitCount: 24,
        value: 'Ape',
      },
      {
        id: '614f8cb40058359200bcffc8',
        traitType: 'type',
        traitCount: 3840,
        value: 'Female',
      },
      {
        id: '614f8cb40058359200bcffc9',
        traitType: 'type',
        traitCount: 6039,
        value: 'Male',
      },
    ],
  };

  const assets = [
    {
      key: 'type',
      value: 'Male',
    },
    {
      key: 'type',
      value: 'Female',
    },
    {
      key: 'accessory',
      value: 'Fedora',
    },
    {
      key: 'accessory',
      value: 'Tiara',
    },
    {
      key: 'accessory23',
      value: 'Tiara',
    },
  ];

  // const test = await prisma.asset.findMany({
  //   where: {
  //     collection: {
  //       slug: {
  //         equals: 'guttercatgang',
  //       },
  //     },
  //   },
  //   take: 10,
  // });

  // const collection1 = await prisma.collection.findUnique({
  //   where: { slug: '0n1-force' },
  //   select: {
  //     id: true,
  //     slug: true,
  //   },
  // });

  // const traits1 = await prisma.trait.findMany({
  //   where: {
  //     collectionId: collection1!.id,
  //   },
  // });

  const attributes = await prisma.collection.findUnique({
    where: {
      slug: 'boredapeyachtclub',
    },
    select: {
      Trait: {
        select: {
          traitCount: true,
          traitType: true,
          value: true,
        },
      },
    },
  });

  const t = [
    {
      traitCount: 713,
      traitType: 'Mouth',
      value: 'Grin',
    },
    {
      traitCount: 215,
      traitType: 'Fur',
      value: 'Dmt',
    },
  ].map((t) => t.traitType);

  const attribute_names = Array.from(new Set(attributes?.Trait.map((trait) => trait.traitType))).sort();
  const missing_attributes = attribute_names.filter((x) => !t.includes(x));

  console.log(attribute_names?.length);
  console.log(attributes?.Trait.length);

  return res.json({
    success: true,
    // traitIDs: assets.map((a) => {
    //   const found = traits.Trait.find((t) => t.traitType === a.key && t.value === a.value);
    //   return found ? found.id : null;
    // }),
    // traitIDs: assets.map((a) => traits.Trait.find((t) => t.traitType === a.key && t.value === a.value)),
    missing_attributes,
    attribute_names,
    t,
    attributes,
    traitIDs: assets.map((a) => {
      const found = traits.Trait.find((t) => t.traitType === a.key && t.value === a.value);
      return found ? found.id : undefined;
    }),
    traitIDs1: traits.Trait.filter((t) => {
      return assets.find((a) => a.key === t.traitType && a.value === t.value);
    }).map((x) => {
      return x.id;
    }),
  });
}
