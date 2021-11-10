export interface CollectionCard {
  blockchain: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string;
  totalSupply: number;
  medias?: { [key: string]: string };
}
