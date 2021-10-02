import { Cluster } from 'puppeteer-cluster';
import appRoot from 'app-root-path';
import fs from 'fs';
import _ from 'lodash';

const outputPath = appRoot + '/src/config/bayc_collection.json';

import collectionData from '../../config/bayc_collection.json';

const assets: any[] = [];

let allTraits = {};

let totalPunk = 0;
let traitTypeId = 0;
let traitDetailTypeId = 0;
let punkTraitTypeId = 0;
let punkScoreId = 0;

let traitTypeIdMap: any = {};
let traitTypeCount: any = {};
let traitDetailTypeIdMap: any = {};
let traitDetailTypeCount: any = {};
let punkTraitTypeCount: any = {};

const scrape = async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 3,
    monitor: true,
    sameDomainDelay: 1500,
  });

  await cluster.task(async ({ page, data }) => {
    const response = await page.goto(data.url);
    const body = JSON.parse(await response.text());

    assets.push({ id: data.id, data: body });
  });

  Promise.all(
    Array.from({ length: 10000 }).map(async (_, i) => {
      await cluster.queue({ url: `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${i}`, id: i });
    })
  );

  await cluster.idle();
  await cluster.close();

  const ordered = assets.sort((a, b) => a.id - b.id);
  const a = ordered.map(({ data }) => ({ ...data }));

  await fs.promises.appendFile(outputPath, JSON.stringify(a));
};

export default async function handler(req: any, res: any) {
  const assets = [];

  await Promise.all(
    collectionData.map(async (x, i) => {
      const data = {
        id: 0,
        name: '',
      };

      data.id = i;
      data.name = `Bored Ape Yacht Club ${i}`;

      await Promise.all(
        x.attributes.map((a) => {
          if (_.isEmpty(a.trait_type) || _.isEmpty(a.value)) return;

          if (!traitTypeCount.hasOwnProperty(a.trait_type)) {
            traitTypeIdMap[a.trait_type] = traitTypeId;
            traitTypeId = traitTypeId + 1;
            traitTypeCount[a.trait_type] = 0 + 1;
          } else {
            traitTypeCount[a.trait_type] = traitTypeCount[a.trait_type] + 1;
          }

          if (!traitDetailTypeCount.hasOwnProperty(a.value)) {
            traitDetailTypeIdMap[a.value] = traitDetailTypeId;
            traitDetailTypeId = traitDetailTypeId + 1;
            traitDetailTypeCount[a.value] = 0 + 1;
          } else {
            traitDetailTypeCount[a.value] = traitDetailTypeCount[a.value] + 1;
          }

          punkTraitTypeId = punkTraitTypeId + 1;
        })
      );
    })
  );

  console.log({
    traitTypeIdMap,
  });

  console.log({
    traitTypeId,
  });

  console.log({
    traitTypeCount,
  });

  console.log({
    traitDetailTypeCount,
  });

  return res.json({
    success: true,
  });
}
