import puppeteer from 'puppeteer';
import appRoot from 'app-root-path';
import fs from 'fs';

const outputPath = appRoot + '/src/config/guttercatgang.json';

const assets: any[] = [];

class OpenSea {
  BROWSER: puppeteer.Browser | null;
  ASSETS_PAGE: puppeteer.Page | null;

  constructor() {
    this.BROWSER = null;
    this.ASSETS_PAGE = null;
  }

  // async getAllAssets(slug: string, supply: number) {
  //   if (!slug) throw new Error('Invalid Slug');
  //   if (!supply) throw new Error('Invalid Supply');

  //   if (!this.BROWSER) {
  //     this.BROWSER = await puppeteer.launch({ headless: false });
  //     this.ASSETS_PAGE = await this.BROWSER.newPage();
  //   }
  // }
}

const searchAssetsQuery = async (slug: string, cursor: string | null): Promise<string> => {
  return `{query { search(collections: ["${slug}"], first: 100, sortBy: CREATED_DATE, after: "${cursor ?? ''}") {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
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
  } }}`;
};
