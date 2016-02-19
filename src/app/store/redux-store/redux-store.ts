import {IDispatch} from 'redux';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
const lodashGet = require('lodash/get');

export interface IMapStateToTarget {
  (state: any): {};
}

export interface IMapDispatchToTarget {
  (dispatch: IDispatch) : {[key: string]: Function};
}

export abstract class ReduxStore<T> {

  static initialized = false;
  static defaultMapStateToTarget: IMapStateToTarget = () => ({});
  static defaultMapDispatchToTarget: IMapDispatchToTarget = dispatch => ({ dispatch });

  state$: BehaviorSubject<T>;

  constructor(private store) {
    if (!store) {
      throw new Error(`Store cannot be undefined. Make sure to pass the redux store
        as the only argument of the constructor.`);
    }
    if (ReduxStore.initialized) {
      throw new Error('Only one redux store can exist per application.');
    }
    ReduxStore.initialized = true;

    this.state$ = new BehaviorSubject(store.getState());
    this.store.subscribe(() => {
      this.state$.next(this.store.getState());
    });
  }

  getState(): T {
    return this.store.getState();
  }

  dispatch(action) {
    return this.store.dispatch(action);
  }

  subscribe(listener: Function) {
    return this.store.subscribe(() => listener(this.getState()));
  }

  connect(mapStateToTarget: IMapStateToTarget,
    mapDispatchToTarget: IMapDispatchToTarget = ReduxStore.defaultMapDispatchToTarget) {
    const mappedState = mapStateToTarget(this.store.getState());
    const boundActionCreators = mapDispatchToTarget(this.store.dispatch);

    return (target) => {
      //Initial update
      Object.assign(target, boundActionCreators);
      this.updateTargetState(target, mappedState);

      const unsubscribe = this.store.subscribe(() => {
        const nextMappedState = mapStateToTarget(this.store.getState());
        this.updateTargetState(target, nextMappedState);
      });

      return unsubscribe;
    };
  }

  select<R>(keyOrSelector: ((state: T) => R) | string | number | symbol): Observable<R> {
    if (
      typeof keyOrSelector === 'string' ||
      typeof keyOrSelector === 'number' ||
      typeof keyOrSelector === 'symbol'
    ) {
      return this.state$.map(state => lodashGet(state, keyOrSelector)).distinctUntilChanged();
    } else if (typeof keyOrSelector === 'function') {
      return this.state$.map(keyOrSelector).distinctUntilChanged();
    } else {
      throw new TypeError(
        `Store@select Unknown Parameter Type: `
        + `Expected type of function or valid key type, got ${typeof keyOrSelector}`
      );
    }
  }

  private updateTargetState(target, state) {
    if (typeof target === 'function') {
     target(state);
   } else {
     Object.assign(target, state);
   }
  }
}
