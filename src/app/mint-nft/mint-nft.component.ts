import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment.development';
import { CommonButtonComponent } from '../common/common-button/common-button.component';
import { FormInputsContainerComponent } from '../common/form-inputs-container/form-inputs-container.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ImageSendResponse } from '../image-uploader/image-uploader.model';
import { nftStore } from '../store/nfts/nft.store';
import { Nft } from '../_models/nft.model';
import { ChangeBackgroundService } from '../_services/common/change-background.service';
import { FormValidationService } from '../_services/form/form-validation.service';
import { ImageUploadService } from '../_services/image/image-upload.service';

@Component({
  selector: 'app-mint-nft',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, ImageUploaderComponent,
    CommonModule, CommonButtonComponent, FormInputsContainerComponent,
    MatProgressSpinner],
  providers: [nftStore],
  templateUrl: './mint-nft.component.html',
  styleUrl: './mint-nft.component.scss'
})
export class MintNftComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private imageUploadService = inject(ImageUploadService);
  private validateService = inject(FormValidationService);
  private errorMessages: Record<string, Record<string, string>[]> = {
    description: [{
      required: "Description is required.",
      maxlength: "Description must be at most 360 characters in length."
    }],
    artistName: [{
      required: "Artist name is required."
    }],
    shortDescription: [{
      required: "Brief description is required.",
      maxlength: "Brief description must be at most 24 characters long."
    }]
  };
  
  nftImageSendUrl = environment.apiUrl + "nft/sendNftImage";
  form!: FormGroup;
  newNfts = signal(Array<Nft>());
  nftStore = inject(nftStore);
  decriptionErrorMessage = signal<string>("");
  shortDescriptionErrorMessage = signal<string>("");
  artistNameErrorMessage = signal<string>("");
  changeBgService = inject(ChangeBackgroundService);

  
  ngOnInit() {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.maxLength(360)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(24)]],
      artistName: ['', [Validators.required]],
    });
    
    // this.form.statusChanges.subscribe(_ => this.validateFormInputs(this.form.controls['description']));
    this.form.statusChanges.subscribe(_ => this.validateForm(true));
    this.changeBgService.changeBackgroundSubject$.next("horizontal");
  }

  validateForm(checkIfDirty: boolean): void {
    this.validateService.validateFormInputs(this.form.controls, this.errorMessages,
      { 
        description: this.decriptionErrorMessage,
        shortDescription: this.shortDescriptionErrorMessage,
        artistName: this.artistNameErrorMessage
      },
      checkIfDirty);
  }

  onSubmit() {
    // this.validateFormInputs(this.form.controls['description']);
    this.validateForm(false);

    if (this.form.valid) {
      this.nftStore.setCreateNftLaoding();
      this.imageUploadService.sendImageSub$.next(true);
    }
    // this.nftService.mintNft(this.form.value).subscribe({
    //   next: (res) => {
    //     // if (res.token)
    //       // route to home
    //       // this.router.navigateByUrl("home");
    //       console.log(res);
    //       let newNfts = new Array<Nft>();
    //       res.forEach((newNft: any) => {
    //         newNfts.push({
    //           description: "lorem ipsum dolor sit amet, dolor sit amet",
    //           id: newNft.id,
    //           image: "http://honeybadger.com/image"
    //         })
    //       });
    //       this.newNfts.set(newNfts);
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }
    // })
  }

  handleImageSendResponse(event: ImageSendResponse) {
    if (event.result !== 'ERORR')
      this.nftStore.createNft({ 
        id: event.data.id, 
        description: this.form.value.description, 
        image: '',
        artistName: this.form.value.artistName,
        shortDescription: this.form.value.shortDescription
      });
      // this.nftService.sendNftDetails(event.data?.id, this.form.value.description).subscribe({
      //   next: res => console.log(res)
      // })
    
  }

  // validateFormInputs(control: AbstractControl): void {
  //   if (control.hasError('required')) {
  //     this.errorMessage.set('Description is required.')
  //   } else if (control.hasError('maxlength')) {
  //     this.errorMessage.set('Description must be at most 360 characters in length.')
  //   }
  // }
}
