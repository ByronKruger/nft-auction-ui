import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { AuctionComponent } from './auction/auction.component';
import { ClaimDepositComponent } from './claim-deposit/claim-deposit.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MintNftComponent } from './mint-nft/mint-nft.component';
import { NftListComponent } from './nft-list/nft-list.component';
import { RegisterComponent } from './register/register.component';
import { StartAuctionComponent } from './start-auction/start-auction.component';
import { UsersListComponent } from './users-list/users-list.component';
import { adminGuard } from './_guards/admin.guard';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'claim-deposit',
        component: ClaimDepositComponent
    },
    {
        path: 'auction',
        component: AuctionComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-nfts',
        component: NftListComponent,
        data: { "isBidderNfts": true }
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard, adminGuard],
        // canActivateChild: [authGuard, adminGuard],
        children: [
            {
                path: 'mint',
                component: MintNftComponent
            },
            {
                path: 'start-auction',
                component: StartAuctionComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'nfts',
                component: NftListComponent
            },
            {
                path: 'auction',
                component: AuctionComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
