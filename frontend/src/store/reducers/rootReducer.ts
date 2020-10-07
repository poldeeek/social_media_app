import { combineReducers } from "redux";

import authReducer from "./authReducer";
import friendsReducer from "./friendsReducer";
import notificationReducer, {
  INotificationReducer,
} from "./notificationsReducer";

import { IAuth } from "./authReducer";
import { IFriends } from "./friendsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  friends: friendsReducer,
  notifications: notificationReducer,
});

export default rootReducer;

export interface IRoot {
  auth: IAuth;
  friends: IFriends;
  notifications: INotificationReducer;
}
