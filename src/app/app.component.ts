import { Component, computed, effect, inject, OnInit, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './services/user/user.service';
import { MatButtonModule } from '@angular/material/button';
import { AuctionStore } from './store/auction/auction.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateEventsService } from './_services/common/state-events.service';
import { PresenceService } from './_services/signalr/presence.service';
import { UserStore } from './store/users/users.store';
import { ChangeBackgroundService } from './_services/common/change-background.service';
import { ReportingService } from './_services/common/reporting.service';
import { SvgIconRegistryService } from './_services/common/svg-icon-registry.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink,
    MatButtonModule, MatIconModule],
  providers: [AuctionStore, UserStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'NftAuction';
  userService = inject(UserService);
  router = inject(Router);
  auctionStore = inject(AuctionStore);
  snackbar = inject(MatSnackBar);
  mySignal = computed(() => {
    const a = this.auctionStore.auctionStarted();
    console.log("++++" + a);
    return a;
  });
  stateEventsService = inject(StateEventsService);
  presenceHub = inject(PresenceService);
  a: any;
  userStore = inject(UserStore);
  displayMyNfts = signal<boolean>(false);
  changeBgService = inject(ChangeBackgroundService);
  renderer = inject(Renderer2);
  hasFundsEffect = effect(() => {
    console.log("%cthis.userStore.bidderHasFunds()", "background-color: white; color: pink; font-size: 20px");
    console.log(this.userStore.bidderHasFunds());
  })
  private reporting = inject(ReportingService);
  private svgIconRegistry = inject(SvgIconRegistryService);
  
  ngOnInit() {
    this.setNewAuction();
    this.setCurrentUser();
    
    // console.log("this.userService.user()!.token", "background-color: orange; color: purple");
    // console.log(this.userService.user()!.token);
    this.presenceHub.createConnectionForPresence(this.userService.user()!.token);

    // ???
    // effect(() => {
    //   const auction = this.auctionStore.currentBidAmount();
    //   console.log(auction);
    // });
    
    // this.a = effect(() => {
    //   const auctionName = this.auctionStore.auctionStarted();
    //   console.log("%c::::::::::::::::::::::", "background-color: lime; color yellow;");
    //   // this.snackbar.open("<Charity name>" + auctionName);
    // });
    if (this.userService.roles().includes("ADMIN")) {
      this.router.navigateByUrl("admin");
    }

    let hasFunds = this.userService.getTokenData("hasFunds");
    let hasNfts = this.userService.getTokenData("hasNfts");
    this.userStore.setHasFunds(hasFunds);
    this.userStore.setHasNfts(hasNfts);
    
    this.presenceHub.auctionConcludedSubject$.subscribe(
      (auction) => {
        let currentUsername: string = JSON.parse(atob(this.userService.user()!.token.split(".")[1])).unique_name;
        // let currentUsername: string = JSON.parse(atob(this.userStore.userAuth().token.split(".")[1])).unique_name;
        console.log("%c =============================", "background-color: black; color hotpink");
        console.log("currentUsername");
        console.log(currentUsername);
        console.log("auction.winningBidder.username");
        console.log(auction.winningBidder.username);
        console.log((auction.winningBidder.username === currentUsername));
        console.log("%c =============================", "background-color: black; color hotpink");
        if (auction.winningBidder.username === currentUsername) {
          this.displayMyNfts.set(true);
        }
      }
    );

    this.changeBgService.changeBackgroundSubject$.subscribe(bgImage => {
      console.log("%cbgImage", "background-color: black; color: hotpink");
      console.log(bgImage);
      if (bgImage === "horizontal") {
        // document.body.style.backgroundImage = "url('./assets/imgs/purple-line-bg-1.jpg');";
        this.renderer.setStyle(document.body, 'background-image', `url(${'./assets/imgs/purple-line-bg-vertical.jpg'})`);
      } else if (bgImage === "minimal") {
        this.renderer.setStyle(document.body, 'background-image', `url(${'./assets/imgs/purple-line-bg-minimal.jpg'})`);
      } else if (bgImage === "vertical") { // vertical
        this.renderer.setStyle(document.body, 'background-image', `url(${'./assets/imgs/purple-line-bg-vertical.jpg'})`);
      } else {
        this.renderer.setStyle(document.body, 'background-image', 'none');
      }
      this.renderer.setStyle(document.body, 'background-size', 'cover'); // To make sure the background covers the entire body
      this.renderer.setStyle(document.body, 'background-position', 'center');
    });
  }

  setNewAuction() {
    this.stateEventsService.newAuctionEventSubject$.subscribe(
      (auction) => {
        this.auctionStore.setNewAuction(auction);
        let charityName = auction.users[0].username;
        let nftDescription = auction.nft.shortDescription;
        let nftArtistName = auction.nft.artistName;
        this.snackbar.open("Auction started: " + nftDescription + " by " + nftArtistName + "\n for " + charityName + " charity");
      },
      (err) => {
        console.log("%c ::::", "background-color: red; color: crimson;");
      }
    )
  }

  setCurrentUser() {
    const localUser = localStorage.getItem('user');
    if (!localUser) return;
    const user = JSON.parse(localUser);
    this.userService.user.set(user);
  }

  onLogOff() {
    this.userService.logout();
    this.userStore.logOut();
    this.router.navigateByUrl("home");
  }

  reportIssue() {
    this.reporting.reportIssue();
  }
}
