import {ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone} from '@angular/core';
import {delay, Observable, of} from "rxjs";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'debug-change-detection',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl: './debug-change-detection.component.html',
  styleUrl: './debug-change-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugChangeDetectionComponent {
  @Input('fakeInputProperty') fakeInputProperty: string[] = [];
  fakeObservable$ = new Observable<any>();
  counter = 0;
  isZoneJSActive = 'Zone.js is inactive';

  constructor(private ngZone: NgZone,
              private cdRef: ChangeDetectorRef,
              private applicationRef: ApplicationRef,
              ) {
    if (this.ngZone instanceof NgZone) {
      this.isZoneJSActive = `Zone.js is active`;
      console.log('Zone.js is active');
    }
  }

  setFakeObservable(){
    this.fakeObservable$ = of(1,2,3).pipe(delay(2000));
  }

  incrementCounter(){
    this.counter+=1;
  }

  incrementAsyncCounter() {
    setTimeout(() => {
      this.counter++;
    }, 100);
  }

  triggerChangeDetection(){
    this.cdRef.detectChanges();
  }

  incrementOutSideAngular(){
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.counter++;
      }, 100);
    });
  }

  tickApplicationRef(){
    this.applicationRef.tick();
  }
}
