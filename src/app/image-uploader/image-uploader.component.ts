import { CommonModule, DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../environments/environment.development';
import { UserService } from '../services/user/user.service';
import { Nft } from '../_models/nft.model';
import { User, UserToken } from '../_models/user.model';
import { ImageUploadService } from '../_services/image/image-upload.service';
import { ImageSendResponse } from './image-uploader.model';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [FileUploadModule, NgIf, NgClass, 
    NgStyle, NgFor, DecimalPipe, CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent implements OnInit {
  private userService = inject(UserService);
  private imageUploadService = inject(ImageUploadService);
  // nfts = input.required<Nft[]>();
  // nftChanged = output<User>();
  uploader?: FileUploader;
  baseUrl = environment.apiUrl;
  hasBaseDropZoneOver = false;
  isDropped = signal<boolean>(false);
  imageSendUrl = input.required<string>();
  imageSendResponse = output<ImageSendResponse>();
  
  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    console.log("over drop-zone");
    console.log(e);
    console.log(this.isDropped());
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.imageSendUrl(),
      authToken: 'Bearer ' + this.userService.user()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      disableMultipart: false,
      // formatDataFunction: (a:any) => {
      //   console.log("xxx");
      //   console.log(a);
      //   a.formData.append("a");
      //   console.log("xxx");
      // }
    });

    this.uploader.onAfterAddingFile = (file) => {
      console.log("file");
      console.log(file);
      console.log("this.uploader?.getNotUploadedItems()");
      console.log(this.uploader?.getNotUploadedItems());
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log("response");
      console.log(response);
      if (response) {
        console.log("response");
        console.log(response);
        const photo = JSON.parse(response);
        this.imageSendResponse.emit({
            result: 'SUCCESS',
            data: JSON.parse(response)
          });
        // const updatedUser = {...this.nft()}
        // this.nft?.photos.push(photo);
      } 
      // else {
      //   this.imageSendResponse.emit({
      //     data: '',
      //     result: 'ERORR'
      //   });
      // }
    }

    this.imageUploadService.sendImageSub$.subscribe({
      next: () => this.upload()
    });

    // this.uploader.uploadAll();
    // this.uploader.formatDataFunction()
  }
  
  dropped(event: any) {
    console.log("hw");
    console.log(event);
    this.isDropped.set(true);
  }

  upload() {
    console.log("ccc");
    this.uploader?.uploadAll();
  }
}
