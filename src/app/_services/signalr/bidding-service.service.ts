import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BiddingServiceService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;

  constructor() { }

  connect() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '')
      .withAutomaticReconnect()
      .build();

    this.hubMessages();

    this.hubConnection.start();  
  }

  hubMessages() {
    this.hubConnection?.on('NewBidPlaced', () => {
      
    });
  }

}
