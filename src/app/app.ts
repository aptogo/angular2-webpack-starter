import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from 'angular2/core';
import {Store} from './store/store';
import {Observable} from 'rxjs/Observable';
import {bindActionCreators} from 'redux';
import * as CounterActions from './store/actions';
import {IDispatch} from 'redux';

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
  Normal counter:{{counter}}<br/>
  Observable counter:{{counterAsync | async}}<br/>
  <button (click)="increment()">Inc</button>
  <button (click)="decrement()">Dec</button>
  <button (click)="incrementIfOdd()">Inc if Odd</button>
  <button (click)="incrementAsync(2000)">Inc Async</button>
  `
})
export class App implements OnInit, OnDestroy{

  counter: Number;
  counterAsync: Observable<Number>;
  private unsubscribe: Function;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.unsubscribe = this.store.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.counterAsync = this.store.select('counter');
    this.store.state$.subscribe(state => {
      console.log(state);
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    return {
      counter: state.counter
    };
  }

  mapDispatchToThis(dispatch)  {
    return bindActionCreators({
        increment: CounterActions.increment,
        decrement: CounterActions.decrement,
        incrementIfOdd: CounterActions.incrementIfOdd,
        incrementAsync: CounterActions.incrementAsync
    }, dispatch);
  }
}
