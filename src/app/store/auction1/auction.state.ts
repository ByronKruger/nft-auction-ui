import { state } from "@angular/animations";
import { createFeature, createReducer, on } from "@ngrx/store";
import { Auction, GetAuctionResult } from "../../_models/auction.model";
import { Nft } from "../../_models/nft.model";
import { PaginatedResult } from "../../_models/paginator";
import { SelectData } from "../../_models/selectData";
import { AuthResult, Charity, RegisterResult, RoleData, User, UserToken } from "../../_models/user.model";
import { startAuction, startAuctionComplete } from "./auction.actions";

interface State {
    // books: Book[];
    loading: boolean;
    auctions: Auction[];
    activeAuction: GetAuctionResult;
    userAuth: UserToken;
    charities: Array<SelectData>;
    users: Array<User>;
    mintedNft: Nft;
    auctionStarted: number;
    noActiveAuction: boolean;
    nftsForForm: Array<SelectData>;
    nfts: Array<Nft>;
    currentBidAmount: string;
    usersPaginatedResult: PaginatedResult<User>;
    nftsPaginatedResult: PaginatedResult<Array<Nft>>;
    authResult: AuthResult;
    registerResult: RegisterResult;
    roles: Array<SelectData>;
    bidderHasFunds: boolean;
    displayMyNfts: boolean;
}
  
export const initialState: State = {
    displayMyNfts: false,
    bidderHasFunds: false,
    registerResult: {
        errorMessage: ""
    },
    roles: [],
    authResult: {
        errorMessage: "",
        isAuthenticated: false,
    },
    nfts: [],
    nftsForForm: [],
    noActiveAuction: false,
    auctionStarted: 0,
    mintedNft: {
        description: '',
        id: '',
        image: ''
    },
    currentBidAmount: "",
    loading: false,
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
        noActiveAuction: false
    },
    auctions: [],
    userAuth: {
        token: ""
    },
    charities: [],
    users: [],
    usersPaginatedResult: {
        pagination: {
            currentPage: 1,
            itemsPerPage: 10
        }
    },
    nftsPaginatedResult: {
        pagination: {
            currentPage: 1,
            itemsPerPage: 10
        }
    }
};

// export const reducer1 = createReducer(
//     initialState,
//     on(startAuctionComplete, (state, { charityId, nftId }) => ({
//         ...state,
//         activeAuction: {...state.activeAuction, charity: charityId, nft: { ...state.activeAuction.nft, id: nftId }}
//     }))
// )

//     // on(startAuction, (state) => ({
//     //   ...state,
//     //   loading: true,
//     // })),
//     // getAuctions
//     // placeBid

// export const auctionFeature = createFeature({
//     name: 'auction',
//     reducer: reducer1
// });

// export const {
//   name,
//   reducer,
//   selectAuctionState, 
//   selectLoading,
//   selectAuctions,
//   selectActiveAuction
// } = auctionFeature;