import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MintNft, Nft } from '../../_models/nft.model';
import { Pagination, UserParams } from '../../_models/paginator';
import { SelectData } from '../../_models/selectData';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  private apiUrl: string = environment.apiUrl;

  http = inject(HttpClient);

  mintNft(mintNft: Nft): Observable<any> {
    // return of([{id: 33}, {id: 34}, {id:35}, {id:36}]);
    return this.http.post<any>(this.apiUrl + "nft/sendNftDetails", {...mintNft}).pipe(
      map(res => {
        return res;
      })
    );
  }

  getNfts(usedFor?: string, pagination?: Pagination, userParams?: UserParams): Observable<any> {
    let params = new HttpParams();
    if (pagination?.currentPage && pagination?.itemsPerPage) {
      params = params.append("pageSize", pagination.itemsPerPage);
      params = params.append("pageNumber", pagination.currentPage);
    }
    if (usedFor) {
      params = params.append("isStartAuction", true);
    }
    if (userParams?.nftOwnerUsername) {
      params = params.append("filterForOwner", userParams.nftOwnerUsername);
    }

    return this.http.get<any>(this.apiUrl + "nft/getNfts", { observe: 'response', params })
    // .pipe(
      // map((response, index) => {
        // let nfts = response.body;
        // let data = new Array<SelectData | Nft>();
        // console.log("response.body");
        // console.log(response.body);
        // console.log("response.pagination");
        // console.log(response);
        
        // if (usedFor === "forSelect"){
        //   nfts.forEach((nft: any) => {
        //     data.push({
        //       viewValue: nft.id,
        //       value: nft.id
        //     })
        //   });
        //   return data;
        // }
        
        // nfts.forEach((nft: any) => {
        //   data.push({
        //     id: nft.id,
        //     description: nft.description,
        //     image: nft.image
        //   })
        // });
        // return data;
      // })
      // );
    }

    sendNftDetails(id: string, description: string): Observable<any> {
      return this.http.post(this.apiUrl + "nft/sendNftDetails", { id, description });
      // throw new Error('Function not implemented.');
    }
  }

  // let data: SelectData = {
  //   value: nft.id,
  //   viewValue: nft.id
  // }
  // return data;