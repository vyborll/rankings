import appRoot from 'app-root-path';
import fs from 'fs';
import request from 'then-request';

const outputPath = appRoot + '/config/bayc_collection.json';

export const ipfs = async () => {
  await fs.promises.appendFile(outputPath, '[\n');

  Array.from({ length: 100 }).map(async (x) => {});
};

const chunkArray = (arr: any[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
};

const scrape = async (baseUrl: string, id: number) => {
  const url = `${baseUrl}/id`;
  const response = await request('GET', url);
  const body = response.getBody('utf8');

  console.log(body);
};
