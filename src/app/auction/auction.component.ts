import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auction, BidDto } from '../_models/auction.model';
import { AuctionService } from '../_services/auction/auction.service';
import { MatTableModule } from '@angular/material/table';
import { PresenceService } from '../_services/signalr/presence.service';
import { UserService } from '../services/user/user.service';
import { AuctionStore } from '../store/auction/auction.store';
import { StateEventsService } from '../_services/common/state-events.service';
import { CommonButtonComponent } from '../common/common-button/common-button.component';
import { Router } from '@angular/router';
import { CommonDialogComponent } from '../common/common-dialog/common-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { ReportingService } from '../_services/common/reporting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../common/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

export interface BibInfoTableRow {
  bidderName: string;
  time: string;
  amount: number;
}

const ELEMENT_DATA: BibInfoTableRow[] = [
  // {bidderName: "KingSlayer112", time: 'Hydrogen', amount: 1.0079},
  // {bidderName: "5layer112", time: 'Helium', amount: 4.0026},
  // {bidderName: "Leet1337", time: 'Lithium', amount: 6.94},
  // {bidderName: "KelvinWeld99", time: 'Beryllium', amount: 9.0122}
];
 
@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule,
    MatInputModule, MatButtonModule, MatTableModule, CommonButtonComponent,
    CommonDialogComponent, MatDialogModule, FormInputsContainerComponent,
    MatProgressSpinnerModule, EmptyStateComponent],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent {
  private reporting = inject(ReportingService);
  private snackbar = inject(MatSnackBar);

  emptyStateTitle = "There is No Active Auction";
  auctionService = inject(AuctionService);
  auction = signal<Auction | null>(null);
  fb = inject(FormBuilder);
  form = this.fb.group({
    bid: ['', Validators.required]
  });
  presenceHub = inject(PresenceService);
  userService = inject(UserService);
  displayedColumns: string[] = ['bidderName', 'time', 'amount'];
  dataSource = ELEMENT_DATA;
  auctionStore = inject(AuctionStore);
  stateEventsService = inject(StateEventsService);
  router = inject(Router);
  dialog = inject(MatDialog);
  changeBgService = inject(ChangeBackgroundService);
  sub?: Subscription;

  ngOnInit(){
    this.reporting.addUnitOfWork('topLevelFunctionCategory', "active auction");
    this.getAuction();
    this.buildForm();
    this.setBidEventSubjects();
    this.changeBgService.changeBackgroundSubject$.next("none");
  }

  setBidEventSubjects() {
    if (this.sub)
      this.sub.unsubscribe();

    this.sub = this.stateEventsService.newBidEventSubject$.subscribe({
      next: (newBid: BidDto) => {
        this.auctionStore.setNewBid(newBid);
      }
    });
    
    this.stateEventsService.auctionConcludedSubject$.subscribe({
      next: (concludedAuction: any) => {

        // console.log("%cconcludedAuction", "background-color: orange; color: crimson");
        // console.log(concludedAuction);
        // console.log("concludedAuction.nft.image");
        // console.log(concludedAuction.nft.image);

        if (concludedAuction.winningBidder !== null) {
          let dialogRef = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            height: "510px",
            enterAnimationDuration: "300ms",
            exitAnimationDuration: "300ms",
            data: {
              concludedAuction,
            }
          });
          dialogRef.afterClosed().subscribe(_ => {
            this.auctionStore.resetAuction();
          });
        } 
        else {
          this.snackbar.open("Auction concluded");
          this.auctionStore.resetAuction();
        }


        // this.auctionStore.setNewBid(newBid);
        // console.log("concludedAuction");
        // console.log(concludedAuction);
      }
    });

    this.stateEventsService.hubExceptionSubject$.subscribe({
      next: (exceptionMsg: any) => {
        this.snackbar.open(exceptionMsg, "", {
          panelClass: "error-snackbar"
        });
      }
    });
  }

  onGoBack() {
    this.router.navigateByUrl("admin");
  }

  onGoToStartAuction() {
    this.router.navigateByUrl("admin/start-auction");
  }

  buildForm() {
    // this.form = this.fb.group({
    //   bid: ['', Validators.required]
    // });
  }

  getAuction() {
    // this.auctionService.getAuction().subscribe(
    //   (res: Auction) => {
    //     this.auction.set(res);
    //   }
    // );
    this.auctionStore.getAuction();
  }

  onSubmit() {
    this.reporting.addUnitOfWork('subLevelFunctionCategory', "place bid");
    this.presenceHub.createBid({ amount : parseInt(this.form.value.bid!) });

    // this.presenceHub.createBid({ bidAmount : Number.parseInt(this.form.value.bid!) }).then(
    //   (res) => {
    //     console.log(res);
    //     // this.sendMessageForm?.reset();
    //   }
    // ).catch(error => {
    //   console.error(error);
    // });

    // this.auctionStore.placeBid(this.form.value.bid!);
  }

  onConclude() {
    // let concludedAuction = {
    //   "id": 19,
    //   "users": [
    //       {
    //           "id": 6,
    //           "nfts": [],
    //           "wallet": null,
    //           "username": "UJ_Under-Grads"
    //       }
    //   ],
    //   "winningBidder": {
    //       "id": 14,
    //       "nfts": [
    //           {
    //               "id": 1,
    //               "image": "https://res.cloudinary.com/dvbmmu2el/image/upload/v1727111515/nft/vxzfhgq0p6shuh0ach5a.png",
    //               "description": "Test",
    //               "isOwned": true
    //           }
    //       ],
    //       "wallet": {
    //           "id": 11,
    //           "address": "HUGGER77889",
    //           "availableBalance": 0.9,
    //           "userId": 14
    //       },
    //       "username": "Anchovy_B"
    //   },
    //   "nft": {
    //       "id": 1,
    //       "image": "https://res.cloudinary.com/dvbmmu2el/image/upload/v1727111515/nft/vxzfhgq0p6shuh0ach5a.png",
    //       "description": "Test",
    //       "isOwned": true
    //   },
    //   "isActive": false,
    //   "charity": null,
    //   "bids": [
    //       {
    //           "amount": 17,
    //           "username": "Anchovy_B",
    //           "time": "10/04/2024 15:55:35"
    //       },
    //       {
    //           "amount": 18,
    //           "username": "Anchovy_B",
    //           "time": "10/04/2024 15:55:53"
    //       },
    //       {
    //           "amount": 19,
    //           "username": "Anchovy_B",
    //           "time": "10/04/2024 15:56:02"
    //       }
    //   ]
    // }
    // this.stateEventsService.auctionConcludedSubject$.next(concludedAuction);

    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      height: "510px",
      // data: {
      //   concludedAuction,
      // }
    });
    dialogRef.afterClosed().subscribe(response => {
      // this.auctionStore.resetAuction();
      this.presenceHub.concludeAuction();
    });

  }
}
