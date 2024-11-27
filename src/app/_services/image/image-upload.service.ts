import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  sendImageSub$ = new Subject<boolean>();
  // sendImageSig = signal<boolean>(false);

  // getSendImage() {
  //   return this.sendImageSig();
  // }

  // setSendImage(sendImage: boolean) {
  //   this.sendImageSig.set(sendImage);
  // }
}
