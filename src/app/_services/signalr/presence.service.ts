import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuctionStore } from '../../store/auction/auction.store';
import { Bid, BidDto, StartAuction } from '../../_models/auction.model';
import { StateEventsService } from '../common/state-events.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  // private hubUrl = "https://localhost:5001/hubs/";
  private hubUrl = environment.hubUrl;
  private presenceConnection?: HubConnection;
  // private auctionStore = inject(AuctionStore);
  private statemEventsService = inject(StateEventsService);
  private snackBar = inject(MatSnackBar);

  auctionConcludedSubject$ = new Subject<any>();

  createConnection(bid: StartAuction, token: string) {
    this.presenceConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "bidding?charity=" + bid.charity + "&nft=" + bid.nft, {
        accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .build();

      this.hubMessages();
      this.presenceConnection.start().catch(err => {
        // console.log("err")
        // console.log(err)
        // console.log("err")
        // console.log("%c------------------------------------", "background-color: brown");
        // console.log(exception);
        this.statemEventsService.hubExceptionSubject$.next(err);
      });
  }

  createConnectionForPresence(token: string) {
    this.presenceConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "bidding", {
        accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .build();

      this.hubMessages();
      this.presenceConnection.start().catch(err => console.error(err));
  }

  async createBid(bid: Bid) {
    // var bidDto: BidDto = { Amount: bid.amount };
    return this.presenceConnection?.invoke('PlaceBid', bid)
      .catch(error => {
        console.error(error)
        this.snackBar.open("Bid is lower than current highest.");
      });
    // this.presenceConnection = new HubConnectionBuilder()
    //   .withUrl(this.hubUrl + "bidding?charity=" + bid.charityId + "&nft=" + bid.nftId, {
    //     accessTokenFactory: () => token 
    //   })
    //   .withAutomaticReconnect()
    //   .build();

    //   this.hubMessages();
    //   this.presenceConnection.start().catch(err => console.error(err));
  }

  async concludeAuction() {
    return this.presenceConnection?.invoke('ConcludeAuction')
      .catch(error => {
        console.error(error)
        this.snackBar.open("Auction conclude issue.");
      });
  }

  hubMessages() {
    if (this.presenceConnection) {
      this.presenceConnection.on("NewAuction", (auction) => {
        console.log("auctionId 123");
        console.log(auction);
        this.statemEventsService.newAuctionEventSubject$.next(auction);
        // this.auctionStore.getNewAuction(auctionId);
      });

      this.presenceConnection.on("NewBidPlaced", (newBid: BidDto) => {
        console.log("%cnewBid", "background-color: orange; color: red; font-size: 40px");
        console.log(newBid);
        this.statemEventsService.newBidEventSubject$.next(newBid);
      })

      this.presenceConnection.on("AuctionConcluded", (concludedAuction: any) => {
        console.log("%cxxxxxxxxxxxxxxxxxx", "background-color: crimson");
        console.log(concludedAuction);
        this.statemEventsService.auctionConcludedSubject$.next(concludedAuction);
        this.auctionConcludedSubject$.next(concludedAuction);
      })

      this.presenceConnection.on("HubException", (exception: any) => {
        console.log("%c------------------------------------", "background-color: brown");
        console.log(exception);
        this.statemEventsService.hubExceptionSubject$.next(exception);
      })
    }
  }

  stopConnection() {
    this.presenceConnection?.stop().catch(error => console.error(error));
  }

}
