import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserService } from "../../services/user/user.service";
import { ClaimDeposit, UserLogin, UserRegister } from "../../_models/user.model";
import { initialState } from "../auction1/auction.state";
import { Router } from "@angular/router";
import { Pagination, UserParams } from "../../_models/paginator";

// const setHasFunds = (store: any, token: string) => {
//     let hasFunds: boolean | string = JSON.parse(atob(token.split(".")[1])).hasFunds;
//     console.log("hasFunds");
//     console.log(hasFunds);
//     hasFunds = (hasFunds === "False") ? false : true;
//     console.log("hasFunds'");
//     console.log(hasFunds);

//     if (hasFunds) {
//         console.log("%chasFunds true", "background-color: seagreen; color: lime");
//         patchState(store, { bidderHasFunds: true }); 
//     }
//     else {
//         console.log("%chasFunds false", "background-color: salmon; color: crimson");
//         patchState(store, { bidderHasFunds: false }); 
//     }
// }

const setDisplayMyNfts = (store: any, token: string) => {
    let hasNfts: boolean | string = JSON.parse(atob(token.split(".")[1])).hasNfts;
    console.log("%c =============================", "background-color: hotpink; color: black");
    console.log("hasNfts");
    console.log(hasNfts);
    hasNfts = hasNfts === "True" ? true : false;
    console.log("hasNfts'");
    console.log(hasNfts);
    if (hasNfts) patchState(store, { displayMyNfts: hasNfts });
}

export const UserStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store, userService = inject(UserService), router = inject(Router)) => ({

        authUser(userLogin: UserLogin): void {
            patchState(store, { loading: true });
            userService.login(userLogin).subscribe({
              next: (res) => {
                patchState(store, { loading: false, userAuth: { token: res.token }, authResult: { ...store.authResult(), isAuthenticated: true } });
               
                // ===========================================================
                // setHasFunds(store, res.token);
                let hasFunds: boolean | string = JSON.parse(atob(res.token.split(".")[1])).hasFunds;
                console.log("hasFunds");
                console.log(hasFunds);
                hasFunds = (hasFunds === "False") ? false : true;
                console.log("hasFunds'");
                console.log(hasFunds);
            
                if (hasFunds) {
                    console.log("%chasFunds true", "background-color: seagreen; color: lime");
                    patchState(store, { bidderHasFunds: true }); 
                }
                else {
                    console.log("%chasFunds false", "background-color: salmon; color: crimson");
                    patchState(store, { bidderHasFunds: false }); 
                }
                // ============================================================
                
                // ============================================================
                // setDisplayMyNfts(store, res.token);
                let hasNfts: boolean | string = JSON.parse(atob(res.token.split(".")[1])).hasNfts;
                console.log("%c =============================", "background-color: hotpink; color: black");
                console.log("hasNfts");
                console.log(hasNfts);
                hasNfts = hasNfts === "True" ? true : false;
                console.log("hasNfts'");
                console.log(hasNfts);
                patchState(store, { displayMyNfts: hasNfts });
                // ===========================================================
                
                router.navigateByUrl("home");
              },
              error: (error) => {
                patchState(store, { loading: false } );
                const errorMessage = error.error;
                console.log("%cerrorMessage", "background-color: orange; color: crimson");
                console.log(errorMessage);

                if (errorMessage === "Invalid password" || errorMessage === "Invalid username") {
                    console.log("yyyyyyyy");
                    patchState(store, {
                        authResult: { 
                            errorMessage: "Invalid username and/or password.", 
                            isAuthenticated: false 
                        }
                    });
                }
                patchState(store, { authResult: { ...store.authResult() } });
              }
            })
        },

        logOut(): void {
            patchState(store, { ...initialState });
        },

        getCharities: (store: any): void => {
            patchState(store, { loading: true });
            userService.getCharities("forSelect")
            // .pipe(
                // map(charities => {
                    // patchState(store, { loading: false, charities });
                // })
            // )
            .subscribe({
              next: (charities) =>  patchState(store, { loading: false, charities })
            });
        },

        setHasFunds(hasFunds: boolean): void {
            patchState(store, { bidderHasFunds: hasFunds });
        },

        setHasNfts(hasNfts: boolean): void {
            patchState(store, { displayMyNfts: hasNfts });
        },

        // getCharities: rxMethod<any>(
        //     pipe(
        //       debounceTime(300),
        //       distinctUntilChanged(),
        //       tap(() => patchState(store, { loading: true })),
        //       switchMap(() => {
        //         return userService.getCharities("forSelect").pipe(
        //           tapResponse({
        //             next: (charities) => patchState(store, { loading: false, charities }),
        //             error: (err) => {
        //               patchState(store, { loading: false });
        //               console.error(err);
        //             },
        //           })
        //         );
        //       })
        //     )
        //   ),

        getUsers(pagination?: Pagination, userParams?: UserParams): void {
            patchState(store, { loading: true });

            const paginationData = pagination ? pagination : store.usersPaginatedResult().pagination;
            userService.getUsers(paginationData, userParams).subscribe({
                next: (response) => {
                    patchState(store, { loading: false });
                    console.log(response);
                    if (response.body) {
                        patchState(store, { users: response.body, usersPaginatedResult: { result: response.body } });
                    }
                    patchState(store, { usersPaginatedResult: { pagination: response.pagination } })
                }
            })
        },

        getUserRoles(): void {
            patchState(store, { loading: true });
            userService.getRoles().subscribe({
                next: (res) => {
                    patchState(store, { loading: false, roles: res });
                }
            });
        }, 

        claimDeposit(claimDeposit: ClaimDeposit): void {
            patchState(store, { loading: true });
            userService.claimDeposit(claimDeposit).subscribe({
                next: _ => {
                    console.log("%chasFunds true", "background-color: seagreen; color: lime");
                    patchState(store, { loading: false, bidderHasFunds: true });
                    router.navigateByUrl("home");
                },
                error: _ => patchState(store, { loading: false })
            });
        },

        registerUser(user: UserRegister): void {
            patchState(store, { loading: true });
            userService.registerUser(user).subscribe({
                next: res => {
                    patchState(store, { loading: false, userAuth: res, 
                        registerResult: {
                            errorMessage: ""
                        },
                    });
                    router.navigateByUrl("home");
                },
                error: error => {
                    const errorMessage = error.error;
                    console.log("%cerrorMessage", "background-color: orange; color: crimson");
                    console.log(errorMessage);

                    if (errorMessage === "Username already exists") {
                        patchState(store, { loading: false, registerResult: { ...store.registerResult(), errorMessage: "Username already exists." } });
                    }
                }
            });
        }

        // setFailedAuth(authResult1: AuthResult): void {
        //     console.log("authResult1");
        //     console.log(authResult1);
        //     patchState(store, { authResult: { ...store.authResult(), errorMessage: authResult1.errorMessage } });
        // }
    }))
);