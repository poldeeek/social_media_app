import * as actions from "../actions/actionTypes";

export interface ILastMessage {
  _id: string;
  seen: boolean;
  author_id: string;
  text: string;
  update_at: string;
}

export interface IMember {
  avatar: string;
  online: boolean;
  _id: string;
  name: string;
  surname: string;
}

export interface IChat {
  _id: string;
  updated_at: string;
  lastMessage: ILastMessage;
  member: IMember;
}

export interface IChats {
  chats: IChat[];
  loading: boolean;
}

const initState = {
  chats: [],
  loading: false,
};

const friendsReducer = (state: IChats = initState, action: any) => {
  switch (action.type) {
    case actions.CHATS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actions.CHATS_LOADED_SUCCESS:
      return {
        ...state,
        chats: action.chats,
        loading: false,
      };
    case actions.CHATS_LOADED_FAILED:
      return {
        ...state,
        loading: false,
      };
    case actions.FRIEND_STATUS_CHANGE:
      return {
        ...state,
        chats: action.chatsCopy,
      };
    default:
      return state;
  }
};

export default friendsReducer;
