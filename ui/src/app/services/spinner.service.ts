import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

interface SpinnerData {
  showSpinner: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject$ = new Subject<SpinnerData>();
  
  constructor() { }
  
  showSpinner(message: string) {
    this.spinnerSubject$.next({
      showSpinner: true,
      message
    }); // Set spinner state to visible
  }
  
  hideSpinner() {
    this.spinnerSubject$.next({
      showSpinner: false
    });
  }
  
  get spinnerStatus(){
    return this.spinnerSubject$.asObservable();
  }
  
}
