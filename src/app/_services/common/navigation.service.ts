import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  navigatedSubject$ = new Subject<boolean>();

  constructor() { }
}
