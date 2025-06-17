import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {delay, Observable, of} from "rxjs";

@Component({
    selector: 'debug-zone-js',
    standalone: true,
    imports: [CommonModule,MatButtonModule],
    templateUrl: './debug-zone-js.component.html',
    styleUrl: './debug-zone-js.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugZoneJsComponent implements OnInit {
    @Input('showCycles') showCycles = '';
    fakeObservable$ = new Observable<any>();
    counter = 0;
    isZoneJSActive = 'Zone.js is inactive';

    constructor(private ngZone: NgZone,
                private cdRef: ChangeDetectorRef,) {
        if (this.ngZone instanceof NgZone) {
            this.isZoneJSActive = `Zone.js is active`;
            console.log('Zone.js is active');
        }
    }

    ngOnInit() {
        // this.fakeObservable.pipe(delay(5000)).subscribe(data=>console.log(data));
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

    changeInputProperty(){
        this.showCycles = 'some random stuff';
    }
}
