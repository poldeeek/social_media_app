import { combineReducers } from "redux";

import authReducer from "./authReducer";

import { IAuth } from "./authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;

export interface IRoot {
  auth: IAuth;
}
