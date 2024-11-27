import { Nft } from "./nft.model";
// import { User } from "./user.model";

export interface Auction {
    id: string;
    // charity: User;
    charity: string;
    // nft: Nft;
    nft: Nft;
    // bids: Array<BidDisplay>;
    bids: Array<BidDto>;
    // isActive: boolean;
    users: Array<User>;
}

export interface GetAuctionResult {
    auction: Auction;
    errorMessage: string;
    noActiveAuction: boolean;
}

export interface User {
    username: string;
    balance?: string;
    id?: string;
}

// export

export interface StartAuction {
    charity: string;
    nft: string;
}

export interface BidDisplay {
    bidAmount: string;
    username: string;
    time: string;
}

export interface Bid {
    amount: string | number;
}

export interface BidDto {
    amount: string;
    user: any; // change to userDto type thing
    time: string;
}