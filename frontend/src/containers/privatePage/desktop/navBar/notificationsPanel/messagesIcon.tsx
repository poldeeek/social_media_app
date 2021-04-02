import React, { useEffect, useRef, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../../../store/reducers/rootReducer";
import { setNotification } from "../../../../../store/actions/notificationsActions";
import Chats from "../../../chats/chats";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";

const MessagesIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(
    messageRef,
    () => active === "messages" && changeActive("")
  );
  const socket = useSocket();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const notification = useSelector(
    (state: IRoot) => state.notifications.messages
  );

  useEffect(() => {
    const setSocket = () => {
      if (socket === null) return;

      socket.on("new_message", (msg: string) => {
        currentUser &&
          dispatch(setNotification("messages", true, currentUser._id));
      });
    };

    setSocket();
  }, [socket]);

  const onIconClickHandler = () => {
    currentUser &&
      dispatch(setNotification("messages", false, currentUser._id));
    changeActive("messages");
  };

  return (
    <div ref={messageRef}>
      <div
        className={
          active === "messages"
            ? `${styles.icon} ${styles.iconActive}`
            : styles.icon
        }
        title="Wiadomości"
        onClick={() => onIconClickHandler()}
      >
        <i className="fas fa-comments"></i>
        {notification && <div className={styles.notificationDot}></div>}
      </div>
      {active === "messages" && <Chats />}
    </div>
  );
};

export default MessagesIcon;
