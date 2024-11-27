import { CommonModule, JsonPipe } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { NftComponent } from '../nft/nft.component';
import { nftStore } from '../store/nfts/nft.store';
import { UserStore } from '../store/users/users.store';
import { ChangeBackgroundService } from '../_services/common/change-background.service';

@Component({
  selector: 'app-nft-list',
  standalone: true,
  imports: [JsonPipe, MatPaginatorModule, NftComponent,
    MatFormFieldModule, MatButtonModule, MatInputModule,
    CommonModule, FormsModule, FormInputsContainerComponent,
    MatProgressSpinnerModule],
  providers: [nftStore, UserStore],
  templateUrl: './nft-list.component.html',
  styleUrl: './nft-list.component.css'
})
export class NftListComponent implements OnInit {
  private itemsPerPage = 0;
  private currentPage = 0;
  private route = inject(ActivatedRoute);
  
  filterByUsername = "";
  nftstore = inject(nftStore);
  userstore = inject(UserStore);
  changeBgService = inject(ChangeBackgroundService);
  isBidderNfts = false;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isBidderNfts = data['isBidderNfts'];
    });
    this.nftstore.getNfts();
    this.changeBgService.changeBackgroundSubject$.next("vertical");
  }

  getNftsFilteredByOwner() {
    this.nftstore.getNfts(undefined, { currentPage: this.currentPage, itemsPerPage: this.itemsPerPage }, { nftOwnerUsername: this.filterByUsername });
  }

  handlePagination(e: PageEvent): void {
    this.currentPage = e.pageIndex + 1;
    this.itemsPerPage = e.pageSize;
    this.getNftsFilteredByOwner();
  }

}
