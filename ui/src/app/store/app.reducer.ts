import { createReducer, on } from '@ngrx/store';
import * as CounterActions from './app.actions';

export interface CounterState {
    count: number;
}

export const initialState: CounterState = {
    count: 0
};

export const appReducer = createReducer(
    initialState,
    on(CounterActions.increment, state => ({ ...state, count: state.count + 1 })),
    on(CounterActions.decrement, state => ({ ...state, count: state.count - 1 })),
    on(CounterActions.reset, state => ({ ...state, count: 0 })),
    on(CounterActions.setValue, (state, { value }) => ({ ...state, count: value }))
);