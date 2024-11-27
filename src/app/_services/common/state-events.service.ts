import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BidDto } from '../../_models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class StateEventsService {
  public newAuctionEventSubject$ = new Subject<any>();
  public newBidEventSubject$ = new Subject<BidDto>();
  public auctionConcludedSubject$ = new Subject<any>();
  public hubExceptionSubject$ = new Subject<string>();

  constructor() { }
}
