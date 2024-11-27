import { inject } from "@angular/core";
import { signalStore, withMethods, withState, patchState } from "@ngrx/signals";
import { NftService } from "../../_services/nft/nft.service";
import { initialState } from "../auction1/auction.state";
import { Nft } from '../../_models/nft.model';
import { Pagination, UserParams } from "../../_models/paginator";
import { SelectData } from "../../_models/selectData";
import { Router } from "@angular/router";

export const nftStore = signalStore(
    withState(initialState),
    withMethods((store, nftService = inject(NftService),  router = inject(Router)) => ({
        setLoadingOn(): void {
            patchState(store, { loading: true })
        },
        setLoadingOff(): void {
            patchState(store, { loading: false })
        },
        createNft(newNft: Nft): void {
            console.log("%cloading = true", "background-color: white; color: brown; font-size: 20px");
            patchState(store, { loading: true });
            nftService.mintNft(newNft).subscribe({
                next: () => {
                    console.log("%cloading = false", "background-color: brown; color: white; font-size: 20px");
                    patchState(store, { loading: false, mintedNft: { ...newNft } });
                    router.navigateByUrl("home");
                }
            })
        },
        setCreateNftLaoding(): void {
            patchState(store, { loading: true });
        },
        getNfts(usedFor?: string, pagination?: Pagination, userParams?: UserParams): void {
            patchState(store, { loading: true });

            const paginationData = pagination ? pagination : store.nftsPaginatedResult().pagination;

            nftService.getNfts(usedFor, paginationData, userParams).subscribe({
                next: (res) => {
                    let nfts = res.body;
                    let data = new Array<SelectData>();
                    let data1 = new Array<Nft>();

                    if (nfts.length === 0) {
                        patchState(store, {  });
                    }

                    if (usedFor === "forSelect"){
                        nfts.forEach((nft: any) => {
                            data.push({
                                viewValue: nft.shortDescription + " - " + nft.artistName,
                                value: nft.id
                            })
                        });
                        patchState(store, { nftsForForm: data });
                    } 
                    else {
                        nfts.forEach((nft: any) => {
                            data1.push({
                              id: nft.id,
                              description: nft.description,
                              image: nft.image
                            })
                        }); 

                        patchState(store, { 
                            nftsPaginatedResult: {
                                pagination: res.pagination,
                                result: data1
                            } 
                        })
                    }
                    patchState(store, { loading: false })
                    
                    // nfts.forEach((nft: any) => {
                    //   data.push({
                    //     id: nft.id,
                    //     description: nft.description,
                    //     image: nft.image
                    //   })
                    // });
                    // return data;

                    // console.log("res.body");
                    // console.log(res.body);
                    // console.log("res.pagination");
                    // console.log(res.pagination);
                    // patchState(store, { loading: false });
                    // if (usedFor === 'forSelect'){
                    //     console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
                    //     patchState(store, { nftsForForm: res });
                    // }
                    // else {
                    //     console.log("yyyyyyyyyyyyyyyyyyyyyyyy");
                    //     patchState(store, { 
                    //         nftsPaginatedResult: {
                    //             pagination: res.pagination,
                    //             result: res.body
                    //         } 
                    //     })
                    // }
                }
            });
        }
    }))
);