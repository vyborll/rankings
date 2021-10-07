import OpenSea from '@root/utils/lib/opensea';
import _ from 'lodash';

import collectionData from '../../config/bayc_collection.json';

export default async function handler(req: any, res: any) {
	await OpenSea.getAssets('boredapeyachtclub');
	// await OpenSea.test();
	// let count1 = 0;

	// let totalPunk = 0;
	// let traitTypeId = 0;
	// let traitDetailTypeId = 0;
	// let punkTraitTypeId = 0;
	// let punkScoreId = 0;

	// let traitTypeIdMap: any = {};
	// let traitTypeCount: any = {};
	// let traitDetailTypeIdMap: any = {};
	// let traitDetailTypeCount: any = {};
	// let punkTraitTypeCount: any = {};

	// let ignoreTraits: any = [];

	// const config = {
	//   collection_name: 'Bored Ape Yacht Club',
	//   collection_id_from: 0,
	// };

	// collectionData.forEach((element: any) => {
	//   if (_.isEmpty(element.id)) {
	//     element['id'] = count1;
	//   }
	//   if (_.isEmpty(element.name)) {
	//     element['name'] = config.collection_name + ' #' + element.id;
	//   }
	//   if (!element.name.includes('#' + element.id)) {
	//     element['name'] = element['name'] + ' #' + (count1 + config.collection_id_from);
	//   }
	//   if (_.isEmpty(element.description)) {
	//     element['description'] = '';
	//   }
	//   if (_.isEmpty(element.external_url)) {
	//     element['external_url'] = '';
	//   }
	//   if (_.isEmpty(element.animation_url)) {
	//     element['animation_url'] = '';
	//   }

	//   console.log('Prepare punk: #' + element.id);

	//   let thisPunkTraitTypes = [];

	//   if (_.isEmpty(element.attributes) && !_.isEmpty(element.traits)) {
	//     element.attributes = [];
	//     for (const [key, value] of Object.entries(element.traits)) {
	//       element.attributes.push({
	//         trait_type: key,
	//         value: value,
	//       });
	//     }
	//   }

	//   // fake data for date
	//   /*
	//   element.attributes.push({
	//       value: '2456221590',
	//       trait_type: 'date',
	//       display_type: 'date',
	//   });
	//   */

	//   element.attributes.forEach((attribute: any) => {
	//     if (attribute.value) {
	//       attribute.value = attribute.value.toString();
	//     }

	//     if (
	//       _.isEmpty(attribute.trait_type) ||
	//       _.isEmpty(attribute.value) ||
	//       attribute.value.toLowerCase() == 'none' ||
	//       attribute.value.toLowerCase() == '0'
	//     ) {
	//       return;
	//     }

	//     // Trait type
	//     if (!traitTypeCount.hasOwnProperty(attribute.trait_type)) {
	//       let traitDataType = 'string';
	//       if (!_.isEmpty(attribute.display_type) && attribute.display_type.toLowerCase() == 'date') {
	//         traitDataType = 'date';
	//       }
	//       traitTypeIdMap[attribute.trait_type] = traitTypeId;
	//       traitTypeId = traitTypeId + 1;
	//       if (!ignoreTraits.includes(attribute.trait_type.toLowerCase())) {
	//         traitTypeCount[attribute.trait_type] = 0 + 1;
	//       } else {
	//         traitTypeCount[attribute.trait_type] = 0;
	//       }
	//     } else {
	//       if (!ignoreTraits.includes(attribute.trait_type.toLowerCase())) {
	//         traitTypeCount[attribute.trait_type] = traitTypeCount[attribute.trait_type] + 1;
	//       } else {
	//         traitTypeCount[attribute.trait_type] = 0;
	//       }
	//     }

	//     // Trait detail type
	//     if (!traitDetailTypeCount.hasOwnProperty(attribute.trait_type + '|||' + attribute.value)) {
	//       traitDetailTypeIdMap[attribute.trait_type + '|||' + attribute.value] = traitDetailTypeId;
	//       traitDetailTypeId = traitDetailTypeId + 1;
	//       if (!ignoreTraits.includes(attribute.trait_type.toLowerCase())) {
	//         traitDetailTypeCount[attribute.trait_type + '|||' + attribute.value] = 0 + 1;
	//       } else {
	//         traitDetailTypeCount[attribute.trait_type + '|||' + attribute.value] = 0;
	//       }
	//     } else {
	//       if (!ignoreTraits.includes(attribute.trait_type.toLowerCase())) {
	//         traitDetailTypeCount[attribute.trait_type + '|||' + attribute.value] =
	//           traitDetailTypeCount[attribute.trait_type + '|||' + attribute.value] + 1;
	//       } else {
	//         traitDetailTypeCount[attribute.trait_type + '|||' + attribute.value] = 0;
	//       }
	//     }

	//     punkTraitTypeId = punkTraitTypeId + 1;

	//     if (!ignoreTraits.includes(attribute.trait_type.toLowerCase())) {
	//       thisPunkTraitTypes.push(attribute.trait_type);
	//     }
	//   });

	//   if (!punkTraitTypeCount.hasOwnProperty(thisPunkTraitTypes.length)) {
	//     punkTraitTypeCount[thisPunkTraitTypes.length] = 0 + 1;
	//   } else {
	//     punkTraitTypeCount[thisPunkTraitTypes.length] = punkTraitTypeCount[thisPunkTraitTypes.length] + 1;
	//   }

	//   totalPunk = totalPunk + 1;
	//   count1 = count1 + 1;
	// });

	// let count2 = 0;
	// collectionData.forEach((element: any) => {
	//   if (_.isEmpty(element.id)) {
	//     element['id'] = count2;
	//   }

	//   console.log('Analyze punk: #' + element.id);

	//   let thisPunkTraitTypes: any = [];
	//   let thisPunkDetailTraits: any = {};

	//   if (_.isEmpty(element.attributes) && !_.isEmpty(element.traits)) {
	//     element.attributes = [];
	//     for (const [key, value] of Object.entries(element.traits)) {
	//       element.attributes.push({
	//         trait_type: key,
	//         value: value,
	//       });
	//     }
	//   }

	//   element.attributes.forEach((attribute: any) => {
	//     if (attribute.value) {
	//       attribute.value = attribute.value.toString();
	//     }

	//     if (
	//       _.isEmpty(attribute.trait_type) ||
	//       _.isEmpty(attribute.value) ||
	//       attribute.value.toLowerCase() == 'none' ||
	//       attribute.value.toLowerCase() == '0'
	//     ) {
	//       return;
	//     }

	//     thisPunkTraitTypes.push(attribute.trait_type);
	//     thisPunkDetailTraits[attribute.trait_type] = attribute.value;
	//   });

	//   let punkScore: any = {};
	//   let raritySum = 0;
	//   punkScore['id'] = punkScoreId;
	//   punkScore['punk_id'] = element.id;
	//   for (let traitType in traitTypeCount) {
	//     if (thisPunkTraitTypes.includes(traitType)) {
	//       // has trait
	//       let traitDetailType = thisPunkDetailTraits[traitType];
	//       let thisTraitDetailTypeCount = traitDetailTypeCount[traitType + '|||' + traitDetailType];
	//       let traitTypeId = traitTypeIdMap[traitType];
	//       if (!ignoreTraits.includes(traitType.toLowerCase())) {
	//         punkScore['trait_type_' + traitTypeId + '_percentile'] = thisTraitDetailTypeCount / totalPunk;
	//         punkScore['trait_type_' + traitTypeId + '_rarity'] = totalPunk / thisTraitDetailTypeCount;
	//         raritySum = raritySum + totalPunk / thisTraitDetailTypeCount;
	//       } else {
	//         punkScore['trait_type_' + traitTypeId + '_percentile'] = 0;
	//         punkScore['trait_type_' + traitTypeId + '_rarity'] = 0;
	//         raritySum = raritySum + 0;
	//       }
	//       punkScore['trait_type_' + traitTypeId + '_value'] = traitDetailType;
	//     } else {
	//       // missing trait
	//       let thisTraitTypeCount = traitTypeCount[traitType];
	//       let traitTypeId = traitTypeIdMap[traitType];
	//       if (!ignoreTraits.includes(traitType.toLowerCase())) {
	//         punkScore['trait_type_' + traitTypeId + '_percentile'] = (totalPunk - thisTraitTypeCount) / totalPunk;
	//         punkScore['trait_type_' + traitTypeId + '_rarity'] = totalPunk / (totalPunk - thisTraitTypeCount);
	//         raritySum = raritySum + totalPunk / (totalPunk - thisTraitTypeCount);
	//       } else {
	//         punkScore['trait_type_' + traitTypeId + '_percentile'] = 0;
	//         punkScore['trait_type_' + traitTypeId + '_rarity'] = 0;
	//         raritySum = raritySum + 0;
	//       }
	//       punkScore['trait_type_' + traitTypeId + '_value'] = 'None';
	//     }
	//   }

	//   thisPunkTraitTypes = thisPunkTraitTypes.filter((thisPunkTraitType: any) => !ignoreTraits.includes(thisPunkTraitType));
	//   let thisPunkTraitTypeCount = thisPunkTraitTypes.length;

	//   punkScore['trait_count'] = thisPunkTraitTypeCount;
	//   punkScore['trait_count_percentile'] = punkTraitTypeCount[thisPunkTraitTypeCount] / totalPunk;
	//   punkScore['trait_count_rarity'] = totalPunk / punkTraitTypeCount[thisPunkTraitTypeCount];
	//   raritySum = raritySum + totalPunk / punkTraitTypeCount[thisPunkTraitTypeCount];
	//   punkScore['rarity_sum'] = raritySum;
	//   punkScore['rarity_rank'] = 0;

	//   punkScoreId = punkScoreId + 1;
	//   count2 = count2 + 1;
	// });

	return res.json({
		success: true,
		// totalPunk,
		// traitTypeId,
		// traitDetailTypeId,
		// punkTraitTypeId,
		// punkScoreId,
		// traitTypeIdMap,
		// traitTypeCount,
		// traitDetailTypeIdMap,
		// traitDetailTypeCount,
		// punkTraitTypeCount,
	});
}
