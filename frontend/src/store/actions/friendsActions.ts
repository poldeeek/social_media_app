import * as actions from "../actions/actionTypes";

import { api, authenticationHeader } from "../../config/apiHost";

import { IFriend } from "../reducers/friendsReducer";

export const loadFriends = (userID: string) => (
  dispatch: Function,
  getState: Function
) => {
  if (!userID) return;

  dispatch({ type: actions.FRIENDS_LOADING });

  api
    .get(`http://localhost:5000/api/friends/getFriends/${userID}`, {
      headers: authenticationHeader(),
    })
    .then((resp) => {
      dispatch({
        type: actions.FRIENDS_LOADED_SUCCESS,
        friends: resp.data.friends,
      });
    })
    .catch((err) => dispatch({ type: actions.FRIENDS_LOADED_FAILED }));
};

export const changeFriendStatus = (uid: string, status: boolean) => (
  dispatch: Function,
  getState: Function
) => {
  let myState = getState();
  let friendsCopy = JSON.parse(JSON.stringify(myState.friends.friends));

  for (const friend of friendsCopy) {
    if (friend._id === uid) {
      friend.online = status;
      break;
    }
  }

  friendsCopy
    .sort((a: IFriend, b: IFriend) =>
      a.online === b.online ? 0 : a.online ? -1 : 1
    )
    .sort((a: IFriend, b: IFriend) => a.surname.localeCompare(b.surname))
    .sort((a: IFriend, b: IFriend) => a.name.localeCompare(b.name));

  dispatch({
    type: actions.FRIEND_STATUS_CHANGE,
    friendsCopy,
  });
};
