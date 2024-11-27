import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Bid, StartAuction } from '../../_models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);

  getAuction(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "auction/getAuction").pipe(
      map(res => {
        console.log("res");
        console.log(res);
        return res;
      }),
      // catchError(error => {
      //   return of(error);
      // })
      // catchError(err => {
      //   console.log(err))
      //   // return err;
      // }
    );
  }

  startAuction(auction: StartAuction): Observable<any> {
    return this.http.post<any>(this.apiUrl + "auction/startAuction", { ...auction });
  }

  placeBid(bid: Bid): Observable<any> {
    return this.http.post<any>(this.apiUrl + "auction/placeBid", { ...bid });
  }
}
