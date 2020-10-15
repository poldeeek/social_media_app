import * as actions from "../actions/actionTypes";

export interface IFriend {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
  online: boolean;
}

export interface IFriends {
  friends: IFriend[];
  loading: boolean;
}

const initState = {
  friends: [],
  loading: false,
};

const friendsReducer = (state: IFriends = initState, action: any) => {
  switch (action.type) {
    case actions.FRIENDS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actions.FRIENDS_LOADED_SUCCESS:
      return {
        ...state,
        friends: action.friends,
        loading: false,
      };
    case actions.FRIENDS_LOADED_FAILED:
      return {
        ...state,
        loading: false,
      };
    case actions.FRIEND_STATUS_CHANGE:
      return {
        ...state,
        friends: action.friendsCopy,
      };
    default:
      return state;
  }
};

export default friendsReducer;
