import {Injectable} from 'angular2/core';
import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from './reducers';
const createLogger = require('redux-logger');
const thunk = require('redux-thunk');
import {ReduxStore} from './redux-store';

const logger = createLogger({
  stateTransformer: (state) => {
    return {
      counter: state.counter
    }
  }
});

const createStoreWithMiddleware = applyMiddleware(logger, thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

@Injectable()
export class Store extends ReduxStore<any> {

  constructor() {
    super(store);
  }

}
