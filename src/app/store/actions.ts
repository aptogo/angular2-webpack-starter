export const INCREMENT_COUNTER:string = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER:string = 'DECREMENT_COUNTER';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function decrement()  {
  return {
    type: DECREMENT_COUNTER
  };
}

function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

function incrementAsync(delay:number = 1000)  {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}

export default {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
};
