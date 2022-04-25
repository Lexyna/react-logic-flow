/**
 * Reducer factory
 * @param initialState The initialState to create the State with
 * @param handlers An array of reducer functions for this state
 * @returns state
 */

const reducerFactory = (initialState: any, handlers: IHandler) => {
  return function (state = initialState, action: IAction) {
    const handler = handlers[action.type];

    if (handler) return handler(state, action);
    return state;
  };
};

export default reducerFactory;

export interface IAction {
  type: any;
  payload?: any;
}

export interface IHandler {
  [k: string]: reducerFun;
}

export type reducerFun = (state: any, action: any) => any;
