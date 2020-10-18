import * as actions from "../actions/actionTypes";

import { api, authenticationHeader } from "../../config/apiHost";

export const loadChats = (userID: string) => (
  dispatch: Function,
  getState: Function
) => {
  if (!userID) return;

  dispatch({ type: actions.CHATS_LOADING });

  api
    .get(`http://localhost:5000/api/chats/getChatList/${userID}`, {
      headers: authenticationHeader(),
    })
    .then((resp) => {
      dispatch({
        type: actions.CHATS_LOADED_SUCCESS,
        chats: resp.data,
      });
    })
    .catch((err) => dispatch({ type: actions.CHATS_LOADED_FAILED }));
};

export const changeChatFriendStatus = (uid: string, status: boolean) => (
  dispatch: Function,
  getState: Function
) => {
  let myState = getState();
  let chatsCopy = JSON.parse(JSON.stringify(myState.chats.chats));
  for (const chat of chatsCopy) {
    if (chat.member._id === uid) {
      chat.member.online = status;
      break;
    }
  }

  dispatch({
    type: actions.FRIEND_STATUS_CHANGE,
    chatsCopy,
  });
};
