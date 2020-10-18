import { combineReducers } from "redux";

import authReducer, { IAuth } from "./authReducer";
import friendsReducer from "./friendsReducer";
import chatsReducer, { IChats } from "./chatsReducers";
import { IFriends } from "./friendsReducer";
import messangerReducer, { IMessanger } from "./messangerReducer";
import notificationReducer, {
  INotificationReducer,
} from "./notificationsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  chats: chatsReducer,
  notifications: notificationReducer,
  messanger: messangerReducer,
  friends: friendsReducer,
});

export default rootReducer;

export interface IRoot {
  auth: IAuth;
  chats: IChats;
  notifications: INotificationReducer;
  messanger: IMessanger;
  friends: IFriends;
}
