import { api, authenticationHeader } from "../../config/apiHost";
import * as actions from "../actions/actionTypes";
import { IChat } from "../reducers/chatsReducers";

export const addChatByChatObject = (chat: IChat) => (
  dispatch: Function,
  getState: Function
) => {
  let myState = getState();
  let newActiveChats = JSON.parse(
    JSON.stringify(myState.messanger.activeChats)
  );

  const newChat = JSON.parse(JSON.stringify(chat));

  // if this chat is already open, stop the function
  const check = newActiveChats.find((el: IChat) => el._id === chat._id);
  if (check) return;

  if (newActiveChats.length < 3) {
    newActiveChats.push({ ...newChat });
  } else {
    newActiveChats[2] = { ...newChat };
  }

  dispatch({
    type: actions.ADD_CHAT_TO_MESSANGER,
    newActiveChats,
  });
};

export const addChatByFriendId = (friendId: string) => (
  dispatch: Function,
  getState: Function
) => {
  let myState = getState();
  let newActiveChats = JSON.parse(
    JSON.stringify(myState.messanger.activeChats)
  );
  const currentUserId = myState.auth.user._id;

  // get chat information
  api
    .get(
      `http://localhost:5000/api/chats/getChat/${friendId}?user_id=${currentUserId}`,
      {
        headers: authenticationHeader(),
      }
    )
    .then((resp) => {
      dispatch(addChatByChatObject(resp.data));
    });
};

export const removeChat = (chatId: string) => (
  dispatch: Function,
  getState: Function
) => {
  let myState = getState();
  const newActiveChats = JSON.parse(
    JSON.stringify(myState.messanger.activeChats)
  );

  if (newActiveChats.length === 0) return;

  const index = newActiveChats.findIndex((chat: IChat) => {
    return chat._id === chatId;
  });
  newActiveChats.splice(index, 1);
  dispatch({
    type: actions.REMOVE_CHAT_FROM_MESSANGER,
    newActiveChats,
  });
};
