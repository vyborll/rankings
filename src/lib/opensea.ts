import puppeteer from 'puppeteer';

import prisma from '@root/lib/prisma';

class OpenSea {
  API_INTERVAL: number;
  BROWSER: puppeteer.Browser | null;
  PAGE: puppeteer.Page | null;

  constructor() {
    this.API_INTERVAL = 2500;
    this.BROWSER = null;
    this.PAGE = null;
  }

  async getAllCollections() {
    if (!this.BROWSER && !this.PAGE) {
      this.BROWSER = await puppeteer.launch({ headless: false });
      this.PAGE = await this.BROWSER.newPage();
    }

    const collections = await prisma.collections.findUnique({ where: { type: 'collections' } });
    if (!collections) {
      await this.close();
      return;
    }

    const query = await this.getCollectionsQuery(collections?.slugs ?? []);
    const response = await this.sendGqlRequest(query);

    if (response.success) {
      await Promise.all(
        response.data.data.query.collections.edges.map(async (c: any) => {
          const data = {
            slug: c.node.slug,
            name: c.node.name,
            description: c.node.description,
            banner_image_url: c.node.bannerImageUrl,
            image_url: c.node.imageUrl,
            large_image_url: c.node.largeImageUrl,
            discord_url: c.node.discordUrl,
            external_url: c.node.externalUrl,
            twitter_username: c.node.twitterUsername,
            instagram_username: c.node.instagramUsername,
            one_day_volume: c.node.stats.oneDayVolume,
            one_day_change: c.node.stats.oneDayChange,
            one_day_sales: c.node.stats.oneDaySales,
            one_day_average_price: c.node.stats.oneDayAveragePrice,
            seven_day_volume: c.node.stats.sevenDayVolume,
            seven_day_change: c.node.stats.sevenDayChange,
            seven_day_sales: c.node.stats.sevenDaySales,
            seven_day_average_price: c.node.stats.sevenDayAveragePrice,
            thirty_day_volume: c.node.stats.thirtyDayVolume,
            thirty_day_change: c.node.stats.thirtyDayChange,
            thirty_day_sales: c.node.stats.thirtyDaySales,
            thirty_day_average_price: c.node.stats.thirtyDayAveragePrice,
            total_volume: c.node.stats.totalVolume,
            total_sales: c.node.stats.totalSales,
            total_supply: c.node.stats.totalSupply,
            num_owners: c.node.stats.numOwners,
            average_price: c.node.stats.averagePrice,
            num_reports: c.node.stats.numReports,
            market_cap: c.node.stats.marketCap,
            floor_price: c.node.stats.floorPrice,
          };

          await prisma.collection.upsert({
            where: { slug: c.node.slug },
            update: data,
            create: data,
          });
        })
      );
    }

    await this.close();
  }

  async sendGqlRequest(query: string): Promise<{ success: boolean; data: any }> {
    await this.PAGE?.setRequestInterception(true);
    this.PAGE?.on('request', async (interceptedRequest) => {
      const postData = query;
      interceptedRequest.continue({ method: 'GET', postData, headers: { 'content-type': 'application/graphql' } });
    });

    const response = await this.PAGE?.goto('https://api.opensea.io/graphql');
    if (response?.status() === 200) {
      return { success: true, data: JSON.parse(await response.text()) };
    } else {
      return { success: false, data: null };
    }
  }

  async getCollectionsQuery(slugs: string[]): Promise<string> {
    return `{query { collections(collections: [${slugs.map((s) => `"${s}"`)}], first: ${
      slugs.length
    }, sortBy: TOTAL_VOLUME) { pageInfo { startCursor endCursor } edges { node { slug name description bannerImageUrl imageUrl largeImageUrl discordUrl externalUrl twitterUsername instagramUsername stats { oneDayVolume oneDayChange oneDaySales oneDayAveragePrice sevenDayVolume sevenDayChange sevenDaySales sevenDayAveragePrice thirtyDayVolume thirtyDayChange thirtyDaySales thirtyDayAveragePrice totalVolume totalSales totalSupply numOwners averagePrice numReports marketCap floorPrice } } } } }}`;
  }

  async close(): Promise<boolean> {
    await this.BROWSER?.close();
    this.BROWSER = null;
    this.PAGE = null;
    return true;
  }
}

const api = new OpenSea();
export default api;
