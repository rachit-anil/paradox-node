import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {HttpClient} from "@angular/common/http";
import {DebugApiService} from "./debug-api.service";
import {
    catchError,
    concatMap,
    from,
    interval,
    mergeMap,
    of,
    retry,
    switchMap,
    timer
} from "rxjs";

@Component({
    selector: 'app-rxjs',
    standalone: true,
    imports: [
        MatButton
    ],
    templateUrl: './rxjs.component.html',
    styleUrl: './rxjs.component.scss'
})
export class RxjsComponent {
    apis = [
        `https://jsonplaceholder.typicode.com/users/1`,
    ];

    apis$ = from([
        `https://jsonplaceholder.typicode.com/users/1`,
        `https://jsonplaceholder.typicode.com/posts/1`,
    ]);

    ids = [1, 2, 3, 4, 5, 6];

    constructor(private debugApiService: DebugApiService) {
    }

    intervalCalls() {
        interval(500)
            .pipe(
                concatMap(()=> this.debugApiService.makeGetCall(this.apis[0]))
            )
            .subscribe(console.log);
    }

    intervalCallsWithMergeMap(){
        interval(500)
            .pipe(
                mergeMap(()=> this.debugApiService.makeGetCall(this.apis[0]))
            )
            .subscribe(console.log);
    }

    intervalCallsWithSwitchMap(){
        interval(500)
            .pipe(
                switchMap(()=> this.debugApiService.makeGetCall(this.apis[0]))
            )
            .subscribe(console.log);
    }

    initiateSerialCalls() {
        const apis$ = from([
            `https://jsonplaceholder.typicode.com/users/1`,
            `https://jsonplaceholder.typicode.com/posts/1`,
        ]);
        apis$
            .pipe(concatMap((url) => this.debugApiService.makeGetCall(url)))
            .subscribe((data) => console.log(data));
    }

    serialNestedCalls(){
        from(this.ids)
            .pipe(
                concatMap((id)=> this.debugApiService.makeGetCall(`https://jsonplaceholder.typicode.com/users/${id}`)
                    .pipe(
                        concatMap(()=>this.debugApiService.makeGetCall(`https://jsonplaceholder.typicode.com/posts/${id}`))
                    )
                )
            )
            .subscribe(console.log);
    }

    parallelCalls(){
        const apis$ = from([
            `https://jsonplaceholder.typicode.com/users/1`,
            `https://jsonplaceholder.typicode.com/posts/1`,
        ]);
        apis$
            .pipe(mergeMap((url) => this.debugApiService.makeGetCall(url)))
            .subscribe((data) => console.log(data));
    }

    parallelNestedCalls(){
        from(this.ids)
            .pipe(
                mergeMap((id)=> this.debugApiService.makeGetCall(`https://jsonplaceholder.typicode.com/users/${id}`)
                    .pipe(
                        mergeMap(()=>this.debugApiService.makeGetCall(`https://jsonplaceholder.typicode.com/posts/${id}`))
                    )
                )
            )
            .subscribe(console.log);
    }

    retryFailedCalls(){
        this.debugApiService
            .makeGetCall(`https://jsonplaceholder.typicode.com/users/1`)
            .pipe(
                retry(10)
            )
            .subscribe(console.log);
    }

    retryWithExponentialBackOff(){
        this.debugApiService
            .makeGetCall(`https://jsonplaceholder.typicode.com/users/1`)
            .pipe(
                retry({
                    count: 3,
                    delay: (error, retryCount) => {
                    if(error.status === 500) {
                        return timer(1000 * retryCount)
                    }
                    throw error;
                    }
                }),
                catchError(()=>of('Could not retry'))
            )
            .subscribe(console.log);
    }
}
