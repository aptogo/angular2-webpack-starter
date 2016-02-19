import {Component} from 'angular2/core';
import {Store} from './store/store';
import counterActions from './store/actions';
/*
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [Store],
  directives: [],
  pipes: [],
  styles: [],
  template: `
  {{counter}}
  <button (click)="increment()">Inc</button>
  <button (click)="decrement()">Dec</button>
  <button (click)="incrementIfOdd()">Inc if Odd</button>
  <button (click)="incrementAsync(2000)">Inc Async</button>
  `
})
export class App {
  constructor(private store: Store) {
    console.log(store.getState());
  }

  increment() {
    this.store.dispatch(counterActions.increment());
  }

  decrement() {
    this.store.dispatch(counterActions.decrement());
  }

  incrementIfOdd() {
    this.store.dispatch(counterActions.incrementIfOdd());
  }

  incrementAsync() {
    this.store.dispatch(counterActions.incrementAsync());
  }
}
