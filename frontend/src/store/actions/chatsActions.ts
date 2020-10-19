import * as actions from "../actions/actionTypes";

import { api, authenticationHeader } from "../../config/apiHost";

export const loadChats = (userID: string, search:string) => (
  dispatch: Function,
  getState: Function
) => {
  if (!userID) return;
  dispatch({ type: actions.CHATS_LOADING });

  let hasMore = true;
    const limit = 5;

  let url;
  if(search === ""){
      url = `http://localhost:5000/api/chats/getChats/${userID}?limit=${limit}&page=${0}`;
  } else {
      url = `http://localhost:5000/api/chats/searchChats/${userID}?search=${search}&limit=${limit}&page=${0}`;
  }

  api
    .get(url, {
      headers: authenticationHeader(),
    })
    .then((resp) => {

      if(resp.data.length < limit) {
        hasMore = false;
      }

      dispatch({
        type: actions.CHATS_LOADED_SUCCESS,
        chats: resp.data,
        page: 1,
        hasMore
      });
    })
    .catch((err) => dispatch({ type: actions.CHATS_LOADED_FAILED }));
};

export const loadMoreChats = (userID: string, search:string) => (
  dispatch: Function,
  getState: Function
) => {


  const limit = 5;
  if (!userID) return;


    dispatch({ type: actions.CHATS_LOADING });
    let myState = getState();

  let page = JSON.parse(JSON.stringify(myState.chats.page));  
  let hasMore = true;
  let url;
  if(search === ""){
      url = `http://localhost:5000/api/chats/getChats/${userID}?limit=${limit}&page=${page}`;
  } else {
      url = `http://localhost:5000/api/chats/searchChats/${userID}?search=${search}&limit=${limit}&page=${page}`;
  }

  api
    .get(url, {
      headers: authenticationHeader(),
    })
    .then((resp) => {
      console.log(resp, page)
      if(resp.data.length < limit) {
        hasMore = false;
      }
      dispatch({
        type: actions.MORE_CHATS_LOADED_SUCCESS,
        chats: resp.data,
        page: page+1,
        hasMore
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

      dispatch({
        type: actions.CHAT_FRIEND_STATUS_CHANGE,
        chatsCopy,
      });

      break;
    }
  }  
  return;
};


/*

  if(search === ""){
    // If there are element in chats array, get new starting with the updated date of the last one
    if(chatsCopy.length > 0)
      url = `http://localhost:5000/api/chats/getChats/${userID}?limit=${limit}&date=${chatsCopy[chatsCopy.length-1].updated_at}`;
    else
      url = `http://localhost:5000/api/chats/getChats/${userID}?limit=${limit}`;
  } else {
    if(chatsCopy.length > 0)
      url = `http://localhost:5000/api/chats/searchChats/${userID}?search=${search}&limit=${limit}&date=${chatsCopy[chatsCopy.length-1].updated_at}`;
    else
      url = `http://localhost:5000/api/chats/searchChats/${userID}?search=${search}&limit=${limit}`;

*/