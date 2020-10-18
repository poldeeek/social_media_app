import * as actions from "../actions/actionTypes";
import { IChat } from "./chatsReducers";

export interface IMessanger {
  activeChats: IChat[];
}

const initState = {
  activeChats: [],
};

const messangerReducer = (state: IMessanger = initState, action: any) => {
  switch (action.type) {
    case actions.ADD_CHAT_TO_MESSANGER:
      return {
        ...state,
        activeChats: action.newActiveChats,
      };
    case actions.REMOVE_CHAT_FROM_MESSANGER:
      return {
        ...state,
        activeChats: action.newActiveChats,
      };
    default:
      return state;
  }
};

export default messangerReducer;
