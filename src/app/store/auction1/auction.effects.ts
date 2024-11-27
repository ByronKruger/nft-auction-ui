import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map } from "rxjs";
import { AuctionService } from "../../_services/auction/auction.service";
import { startAuction, startAuctionComplete } from "./auction.actions";

export const startAuctionEffect = createEffect(
    (actions$ = inject(Actions), auctionService = inject(AuctionService)) => {
        return actions$.pipe(
            ofType(startAuction),
            exhaustMap((action) => 
                auctionService.startAuction({charity: action.charityId, nft: action.nftId}).pipe(
                    map((res) => startAuctionComplete({ charityId: action.charityId, nftId: action.nftId })),
                    // catchError()
                )
            )
        );
    },
    {functional: true}
);