import React, { useState, useEffect } from "react";
import styles from "./chats.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { useSocket } from "../../../contexts/socketProvider";
import {
  changeChatFriendStatus,
  loadChats,
} from "../../../store/actions/chatsActions";
import { IChat } from "../../../store/reducers/chatsReducers";
import { useMediaQuery } from "react-responsive";
import ChatsElement from "./chatsElement/chatsElement";
import { NavLink } from "react-router-dom";
import { addChatByChatObject } from "../../../store/actions/messangerActions";

const Chats: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const socket = useSocket();
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const chatsState = useSelector((state: IRoot) => state.chats);
  const [modifyFriendsArray, setModifyFriendsArray] = useState<IChat[]>([]);

  const dispatch = useDispatch();

  const chatElementRender = (chat: IChat) => {
    if (isDesktopOrLaptop) {
      return (
        <div onClick={() => dispatch(addChatByChatObject(chat))} key={chat._id}>
          <ChatsElement chat={chat} />
        </div>
      );
    } else {
      return (
        <NavLink
          to={{ pathname: `/friends/${chat._id}`, state: chat }}
          key={chat._id}
        >
          <ChatsElement chat={chat} />
        </NavLink>
      );
    }
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on("online", (msg: string) =>
      dispatch(changeChatFriendStatus(msg, true))
    );
    socket.on("offline", (msg: string) =>
      dispatch(changeChatFriendStatus(msg, false))
    );
  }, [socket]);

  useEffect(() => {
    currentUser && dispatch(loadChats(currentUser._id));
  }, []);

  return (
    <div className={styles.chatsContainer}>
      {!isDesktopOrLaptop && (
        <div>
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Szukaj..."
          />
        </div>
      )}

      <div className={styles.chatsList}>
        {chatsState.loading ? (
          <div className={styles.spinner}>
            <ClipLoader color={"#276a39"} />
          </div>
        ) : (
          chatsState &&
          chatsState.chats.map((chat: IChat) => chatElementRender(chat))
        )}
      </div>
    </div>
  );
};

export default Chats;
