import appRoot from 'app-root-path';
import got from 'got';
import fs from 'fs';
import request from 'then-request';
import PQueue from 'p-queue';

const outputPath = appRoot + '/src/config/bayc_collection1.json';

const assets: any[] = [];

const queue = new PQueue({ concurrency: 20, interval: 2000, intervalCap: 10 });

const ipfs = async (baseUrl: string) => {
  let range = (n: number) => Array.from(Array(n).keys());

  const data = range(10000);

  await Promise.all(
    data.map(async (x) => {
      await queue.add(() => scrape(`${baseUrl}/${x}`, x));
    })
  );

  const ordered = assets.sort((a, b) => a.id - b.id);
  const a = ordered.map(({ data }) => ({ ...data }));

  await fs.promises.appendFile(outputPath, JSON.stringify(a));
};

const scrape = async (url: string, i: number) => {
  const response = await got(url, { responseType: 'json' });
  assets.push({ id: i, data: response.body });
  console.log(`Asset: ${i}`);
};

export const ipfs1 = async (baseUrl: string) => {
  // await fs.promises.appendFile(outputPath, '[\n');

  const requests: {
    url: string;
    i: number;
  }[] = [];

  const assets: {
    id: number;
    data: string;
  }[] = [];

  await Promise.all(
    Array.from({ length: 10000 }).map(async (_, i) => {
      const url = `${baseUrl}/${i}`;

      requests.push({
        url,
        i,
      });
    })
  );

  const chunks = chunkArray(requests, 500);
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (x) => {
        const response = await request('GET', x.url);
        const body = response.getBody('utf8');

        assets.push({
          id: x.i,
          data: body,
        });
      })
    );
  }

  console.log(assets.length);

  // const { results, errors } = await PromisePool.withConcurrency(500)
  //   .for(requests)
  //   .process(async (x) => {
  //     console.log('Process: #' + x.i);

  //     const response = await request('GET', x.url);
  //     const body = response.getBody('utf8');

  //     assets.push({
  //       id: x.i,
  //       data: body,
  //     });
  //   });

  // console.log(assets.length);

  // await Promise.all(
  //   requests.map(async (x) => {
  //     const response = await request('GET', x.url);
  //     const body = response.getBody('utf8');

  //     assets.push({
  //       id: x.i,
  //       data: body,
  //     });

  //     console.log(x.i);
  //   })
  // );

  // await PromisePool.withConcurrency(100)
  //   .for(requests)
  //   .process(async (data, i) => {
  //     const response = await request('GET', data.url);
  //     const body = response.getBody('utf8');

  //     if (data.i === 9999) {
  //       await fs.promises.appendFile(outputPath, body + '\n');
  //     } else {
  //       await fs.promises.appendFile(outputPath, body + ',\n');
  //     }

  //     return body;
  //   });

  // console.log(assets.sort((a, b) => a.id - b.id));

  // await fs.promises.appendFile(outputPath, ']');
};

const chunkArray = (arr: any[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
};

const handleNFT = async (url: string) => {
  const response = await request('GET', url);
  const body = response.getBody('utf8');
};

const handleNFTs = async (url: string, i: number) => {
  const response = await request('GET', url);
  const body = response.getBody('utf8');

  if (i === 9999) {
    await fs.promises.appendFile(outputPath, body + '\n');
  } else {
    await fs.promises.appendFile(outputPath, body + ',\n');
  }
};

export default async function handler(req: any, res: any) {
  await ipfs('https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq');

  // const length = collectionData.length;

  return res.json({
    success: true,
    length,
  });
}
