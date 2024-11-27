import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type BgImageType = "horizontal" | "vertical" | "minimal" | "none";

@Injectable({
  providedIn: 'root'
})
export class ChangeBackgroundService {
  changeBackgroundSubject$ = new Subject<BgImageType>();

}
