import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as AppActions from './app.actions'; // Import your actions

@Injectable()
export class AppEffects {
    // constructor(private actions$: Actions) {
    // }

    private actions$ = inject(Actions); // ← Lazy injection
    //
    // Define an effect that listens for the 'increment' action
    // When 'increment' is dispatched, this effect will log a message to the console.
    incrementCounter$ = createEffect(
        () =>
            this.actions$.pipe(
                // Use ofType to filter for specific actions
                ofType(AppActions.increment),
                // tap allows you to perform side effects without altering the observable stream
                tap(() => {
                    console.log('Counter incremented! This is from the NgRx Effect.');
                    // In a real application, you might call a service here to make an API call
                    // or perform other asynchronous logic.
                })
            ),
        // { dispatch: false } means this effect does NOT dispatch a new action.
        // If it did, you would remove this and return a new action from the tap/map operator.
        { dispatch: false }
    );

}