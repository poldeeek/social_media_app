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
  page: number;
  hasMore: boolean
}

const initState = {
  chats: [],
  loading: false,
  page: 0,
  hasMore: true
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
        chats: [ ...action.chats],
        loading: false,
        page: action.page,
        hasMore: action.hasMore
      };
      case actions.MORE_CHATS_LOADED_SUCCESS:
        return {
          ...state,
          chats: [...state.chats, ...action.chats],
          loading: false,
          hasMore: action.hasMore,
          page: action.page
        };
    case actions.CHATS_LOADED_FAILED:
      return {
        ...state,
        loading: false,
      };
    case actions.CHAT_FRIEND_STATUS_CHANGE:
      return {
        ...state,
        chats: action.chatsCopy,
      };
    default:
      return state;
  }
};

export default friendsReducer;
