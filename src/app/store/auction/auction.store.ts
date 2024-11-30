import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserService } from "../../services/user/user.service";
import { BidDisplay, BidDto } from "../../_models/auction.model";
import { AuctionService } from "../../_services/auction/auction.service";
import { PresenceService } from "../../_services/signalr/presence.service";
import { initialState } from "../auction1/auction.state";

export const AuctionStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, auctionService = inject(AuctionService), presenceService = inject(PresenceService),
        userService = inject(UserService)) => ({

        // startAuction: (store: any, charityId: any, nftId: any ) => {
        //     patchState(store, { ...store.activeAuction, activeAuction: { charityId, nft: { ...store.activeAuction.nft, id: nftId }  }});
        // },

        // startAuction(charityId: any, nftId: any): void {
        //     patchState(store, { loading: true });
        //     auctionService.startAuction({charityId, nftId})
        //     .subscribe({
        //         next: (res) => {
        //             patchState(store, { loading: false, activeAuction: { ...store.activeAuction, charity: charityId, nft: { ...store.activeAuction.nft, id: nftId } } });
        //             // patchState(store, { loading: false, activeAuction: { charity: charityId, nft: { id: nftId } } });
        //         },
        //         error: (error) => {
        //             console.error("My Error");
        //             console.error(error);
        //         }
        //     })
        //     // .pipe(
        //         // map((res) => {
        //             // patchState(store, { loading: false });
        //         // }),
        //         // catchError(() => patchState(store, { loading: false }))
        //     // );
        // },
        // startAuctionWS(charityId: any, nftId: any): void {
        //     // patchState(store, { loading: true });
        //     // auctionService.startAuction({charityId, nftId})
        //     const token = userService.user()!.token;
        //     presenceService.createConnection({ charityId, nftId }, token);
        //     // .subscribe({
        //     //     next: (res) => {
        //     //         patchState(store, { loading: false, activeAuction: { ...store.activeAuction, charity: charityId, nft: { ...store.activeAuction.nft, id: nftId } } });
        //     //     },
        //     //     error: (error) => {
        //     //         console.error("My Error");
        //     //         console.error(error);
        //     //     }
        //     // })
        // },
        setNewAuction(auction: any): void {
            // console.log("auctionId");
            // console.log(auctionId);
            // console.log(store);
            // console.log("store.auctionStarted()");
            // console.log(store.auctionStarted());
            // patchState(store, { auctionStarted: store.auctionStarted() + 1 });
            // patchState(store, { auctionStarted: store.auctionStarted() + 1 });
            patchState(store, { 
                activeAuction: {
                    ...store.activeAuction(),
                    auction: auction,
                    noActiveAuction: false
                }, 
                // noActiveAuction: false, 
                loading: false 
            })
            // patchState(store, { activeAuction: {...store.activeAuction, id: auctionId } });
        },
        getAuction(): void {
            patchState(store, { loading: true });
            auctionService.getAuction().subscribe({
                next: res => {

                    patchState(store, { 
                        activeAuction: {
                            ...store.activeAuction(),
                            auction: res,
                            noActiveAuction: false
                        }, 
                        // noActiveAuction: false, 
                        loading: false 
                    })
                },
                error: err => {
                    const errorMessage = err.error;

                    patchState(store, {
                        activeAuction: {
                            ...store.activeAuction(),
                            errorMessage,
                            noActiveAuction: true
                        },
                        loading: false 
                    })
                }
            })
        },
        setNewBid(newBid: BidDto): void {
            // patchState(store, { loading: true });
            // auctionService.placeBid({ BidAmount: parseInt(bidAmount) }).subscribe({
                // next: (res) => 
                let placeholderBids = [...store.activeAuction().auction.bids];
                placeholderBids.push(newBid);
                let lastFiveBids = placeholderBids.slice(placeholderBids.length-5, placeholderBids.length);
                patchState(store, { 
                    activeAuction: { 
                        ...store.activeAuction(), 
                        auction: {
                            ...store.activeAuction().auction,
                            bids: [...lastFiveBids]
                        }
                    },
                    currentBidAmount: newBid.amount,
                    loading: false
                })
            // })
        },
        
        resetAuction(): void {
            patchState(store, { 
                activeAuction: {
                    auction: {
                        charity: "",
                        id: "",
                        bids: [],
                        users: [],
                        nft: {
                            description: "",
                            id: "",
                            image: ""
                        }
                    },
                    errorMessage: "",
                    noActiveAuction: true
                }
             });
        }
        // placeBid(bidAmount: string): void {
        //     patchState(store, { loading: true });
        //     auctionService.placeBid({ BidAmount: parseInt(bidAmount) }).subscribe({
        //         next: (res) => patchState(store, { 
        //             activeAuction: { ...store.activeAuction(), 
        //                 bids: [...store.activeAuction.bids(), bidAmount.toString()]
        //             },
        //             currentBidAmount: bidAmount,
        //             loading: false
        //         }),
        //     })
        // }
    }))
);



// nfts
    // getNfts
    // mintNfts

// user
    // auth
    // register
    // getAllUsers

// auction
    // startAuction
    // getAuctions
    // placeBid

// admin
    // 