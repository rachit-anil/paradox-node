import {
    AfterContentChecked,
    AfterContentInit, AfterViewChecked, AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, DoCheck,
    Input, NgZone,
    OnChanges, OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {delay} from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'life-cycle-hooks',
    standalone: true,
    imports: [
        MatButton,
        CommonModule
    ],
    templateUrl: './life-cycle-hooks.component.html',
    styleUrl: './life-cycle-hooks.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifeCycleHooksComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
    @Input('fakeInputProperty') fakeInputProperty: string[] = [];
    @Input('fakeFruits') fakeFruits: any = [];
    showConsoleLogs = false;

    constructor(private userService: UserService,
                public cdRef: ChangeDetectorRef,
                private ngZone: NgZone) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.showConsoleLogs) console.log('ngOnChanges called');
    }

    ngOnInit() {
        // this.markForCheck();
        if (this.showConsoleLogs) console.log('On Init called: Only once');
    }

    // As ngDoCheck will always run. We can write logic here even if nested properties inside
    // @Input param changes.
    ngDoCheck() {
        if (this.showConsoleLogs) console.log('DoCheck called');
    }

    ngAfterContentInit() {
        if (this.showConsoleLogs) console.log('AfterContentInit called only once');
    }

    ngAfterContentChecked() {
        if (this.showConsoleLogs) console.log('AfterContentChecked called');
    }

    //
    ngAfterViewInit() {
        if (this.showConsoleLogs) console.log('AfterViewInit called only once');
    }

    ngAfterViewChecked() {
        if (this.showConsoleLogs) console.log('AfterViewChecked called');
    }

    ngOnDestroy() {
        if (this.showConsoleLogs) console.log('OnDestroy called only once when component is destroyed');
    }

    triggerChangeDetection() {
        this.cdRef.detectChanges();
    }

    markForCheck() {
        this.ngZone.runOutsideAngular(() => {
            this.cdRef.markForCheck();
        })
        // setTimeout(() => {
        // }, 1000);
    }

    changeSecondFruit() {
        this.fakeFruits[1].qty += 1;
    }

    detach() {
        this.cdRef.detach();
    }

    reattach() {
        this.cdRef.reattach();
    }

    fetchUser() {
        this.userService.getUser()
            .pipe(delay(6000))
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    // this.cdRef.markForCheck();
                },
                error: (error: any) => {console.log(error)},
            });
    }
}
