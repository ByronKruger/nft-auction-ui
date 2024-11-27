export interface MintNft {
    amount: string;
}

export interface Nft {
    id: string;
    description: string;
    image: string;
    shortDescription?: string;
    artistName?: string;
}