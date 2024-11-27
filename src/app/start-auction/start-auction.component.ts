import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { UserService } from '../services/user/user.service';
import { SelectData } from '../_models/selectData';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AuctionStore } from '../store/auction/auction.store';
import { UserStore } from '../store/users/users.store';
import { PresenceService } from '../_services/signalr/presence.service';
import { nftStore } from '../store/nfts/nft.store';
import { FormValidationService } from '../_services/form/form-validation.service';
import { CommonButtonComponent } from '../common/common-button/common-button.component';
import { NavigationService } from '../_services/common/navigation.service';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StateEventsService } from '../_services/common/state-events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-start-auction',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, AsyncPipe, JsonPipe, CommonButtonComponent,
    FormInputsContainerComponent, MatProgressSpinnerModule],
  providers: [AuctionStore, UserStore, nftStore],
  templateUrl: './start-auction.component.html',
  styleUrl: './start-auction.component.css'
})
export class StartAuctionComponent implements OnInit{
  private formBuilder = inject(FormBuilder);
  private  userService = inject(UserService);
  private presenceService = inject(PresenceService);
  private valideService = inject(FormValidationService);
  private errorMessages: Record<string, Record<string, string>[]> = {
    charity: [ { required: "Charity is required." }],
    nft: [ { required: "NFT is required." } ]
  }
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  private displaySnackbar = false;
  
  // navigated = output<boolean>();
  form!: FormGroup;
  nfts = new Array<SelectData>();
  selectedCharity?: string;
  selectedNft?: string;
  auctionStore = inject(AuctionStore);
  userStore = inject(UserStore);
  nftStore = inject(nftStore);
  charityErrorMessage = signal<string>("");
  nftErrorMessage = signal<string>("");
  navigationService = inject(NavigationService);
  changeBgService = inject(ChangeBackgroundService);
  stateEventsService = inject(StateEventsService);
  myEffect = effect(() => {
    console.log("%cthis.nftStore.nftsForForm().length === 0", "background-color: orange; font-size: 20px");
    console.log(this.nftStore.nftsForForm().length === 0);
    if (this.nftStore.nftsForForm().length === 0 && !this.nftStore.loading() && !this.displaySnackbar) {
      this.displaySnackbar = true;
      console.log("%c::::::::::::::::::::::::::::::", "background-color: crimson; color: white");

      this.snackbar.open("No available NFTs for new auction", "", {
        panelClass: "error-snackbar"
      });
    }
  });
  
  // activeAuction$ = this.store.activeAuction;
  // activeAuction = signal<Auction>(this.store.activeAuction());
  // charities = signal(Array<SelectData>());
  // selectedCharity = signal<string>("");
  // selectedNft = signal<string>("");
  // store1 = inject(Store);
  // activeAuction$1 = this.store1.select(selectActiveAuction);

  ngOnInit(): void {
    // this.navigated.emit(true);
    this.navigationService.navigatedSubject$.next(true);
    this.form = this.formBuilder.group({
      charity: ["", Validators.required],
      nft: ["", Validators.required]
    });

    this.form.valueChanges.subscribe(_ => this.validateForm(true));

    this.getCharities();
    this.getNfts();
    this.changeBgService.changeBackgroundSubject$.next("horizontal");
    this.subscribeToException();
    this.subscribeNewAction();
  }

  subscribeToException() {
    this.stateEventsService.hubExceptionSubject$.subscribe({
      next: (exceptionMsg: any) => {
        this.nftStore.setLoadingOff();
        this.snackbar.open(exceptionMsg, "", {
          panelClass: "error-snackbar"
        });
      }
    });
  }

  subscribeNewAction() {
    this.stateEventsService.newAuctionEventSubject$.subscribe({
      next: () => {
        this.nftStore.setLoadingOff();
        this.router.navigateByUrl("home")
      }
    })
  }

  updateForm(field: string) {
    if (field === "charity") {
      this.form.controls[field].setValue(this.selectedCharity);
    } else {
      this.form.controls[field].setValue(this.selectedNft);
    }
    console.log("%c...", "background-color: hotpink; color: pink");
    console.log(field);
    console.log("this.form.controls[field].value");
    console.log(this.form.controls[field].value);
  }

  validateForm(checkIfDirty: boolean): void {
    this.valideService.validateFormInputs(this.form.controls,
      this.errorMessages, 
      {
        charity: this.charityErrorMessage,
        nft: this.nftErrorMessage
      }, 
      checkIfDirty);
  }

  getNfts() {
    this.nftStore.getNfts("forSelect");
    // this.nftService.getNfts("forSelect").subscribe({
    //   next: res => {
    //     this.nfts = res;
    //   },
    //   error: err => {}
    // });
  }

  getCharities() {
    // this.userService.getCharities("forSelect").subscribe({
    //   next: (res: SelectData[]) => {
    //     this.charities.set(res)
    //   }
    // });
    this.userStore.getCharities(this.userStore);
  }

  
  onSubmit() {
    this.validateForm(false)
    if (this.form.valid) {
      this.nftStore.setLoadingOn();
      this.presenceService.createConnection({ charity: this.form.value.charity, nft: this.form.value.nft}, this.userService.user()!.token);
    }
    // 3.
    // this.setNewAuction();
    // this.auctionStore.startAuctionWS(this.form.value.charityId, this.form.value.nftId);
    
    // 2.
    // this.store1.dispatch(startAuction({ charityId: this.form.value.charityId, nftId: this.form.value.nftId }));
    
    // 1.
    // this.auctionService.startAuction(this.form.value).subscribe({
      //   next: res => {
        //     console.log("res");
        //     console.log(res);
        //   }
        // });
        
  }
  // setNewAuction() {
  //   console.log("%c ::::", "background-color: purple; color: lime;");
  //   this.stateEventsService.newAuctionEventSubject$.subscribe((auctionId) => {
  //     console.log("%c ::::", "background-color: pink; col or: hotpink;");
  //     this.auctionStore.setNewAuction(auctionId);
  //   }
  //   //   {
  //   //   next: (auctionId) => {
  //   //   },
  //   //   error: (err) => {
  //   //     console.log("%c ::::", "background-color: red; color: crimson;");
  //   //   }
  //   // }
  //   )
  // }

}
