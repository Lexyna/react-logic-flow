import reducerFactory, { IHandler } from "./ReducerFactory";

const initialState = {};

const handlers: IHandler = {};

const nodeEditorReducer = reducerFactory(initialState, handlers);

export default nodeEditorReducer;
