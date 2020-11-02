import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./chats.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { useSocket } from "../../../contexts/socketProvider";
import {
  changeChatFriendStatus,
  loadChats,
  loadMoreChats,
} from "../../../store/actions/chatsActions";
import { IChat } from "../../../store/reducers/chatsReducers";
import { useMediaQuery } from "react-responsive";
import ChatsElement from "./chatsElement/chatsElement";
import { NavLink } from "react-router-dom";
import { addChatByChatObject } from "../../../store/actions/messangerActions";
import useDebounce from "../../../hooks/useDebounce";

const Chats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // ref to loading div
  const chatsLoader = useRef<HTMLDivElement>(null);

  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const socket = useSocket();
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const chatsState = useSelector((state: IRoot) => state.chats);

  const dispatch = useDispatch();

  useEffect(() => {
    currentUser && dispatch(loadChats(currentUser._id, debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  //infinity scroll - intersection observer callback function
  const loadMore = useCallback(
    (entries) => {
      const target = entries.find(
        (element: IntersectionObserverEntry) =>
          element.target.id === "chatsLoader"
      );
      if (
        target.isIntersecting &&
        currentUser &&
        !chatsState.loading &&
        chatsState.hasMore
      ) {
        dispatch(loadMoreChats(currentUser._id, searchTerm));
      }
    },
    [loadMoreChats, chatsState.hasMore, chatsState.loading]
  );

  //infinity scroll - intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (chatsLoader && chatsLoader.current)
      observer.observe(chatsLoader.current);

    return () => {
      if (chatsLoader.current) observer.unobserve(chatsLoader.current);
    };
  }, [chatsLoader, loadMore]);

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
    socket.on("offline", (msg: string) => {
      dispatch(changeChatFriendStatus(msg, false));
    });
  }, [socket]);

  return (
    <div className={styles.chatsContainer}>
      {!isDesktopOrLaptop && (
        <div>
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Szukaj..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      )}

      <div className={styles.chatsList}>
        {chatsState.chats.length > 0 ? (
          chatsState.chats.map((chat: IChat) => chatElementRender(chat))
        ) : (
          <div className={styles.noFriendsInfo}>Brak znajomych.</div>
        )}
        {chatsState.hasMore && (
          <div ref={chatsLoader} id="chatsLoader" className={styles.spinner}>
            <ClipLoader color={"#276a39"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
