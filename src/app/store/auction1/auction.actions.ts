import { createAction, props } from "@ngrx/store";

export const startAuction = createAction(
    '[Auction] Start Auction',
    props<{ nftId: string; charityId: string }>()
);

export const startAuctionComplete = createAction(
    '[Auction] Start auction complete',
    props<{ nftId: string; charityId: string }>()
);

export const startAuctionError = createAction(
    '[Auction] Start auction error'
);