import * as actions from "../actions/actionTypes";

import { api, authenticationHeader } from "../../config/apiHost";
import { IRoot } from "../reducers/rootReducer";

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
