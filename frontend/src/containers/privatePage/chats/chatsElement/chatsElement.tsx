import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";

import React from "react";
import { useSelector } from "react-redux";
import { IChat } from "../../../../store/reducers/chatsReducers";
import { IRoot } from "../../../../store/reducers/rootReducer";
import styles from "./chatsElement.module.scss";

type props = {
  chat: IChat;
};

const ChatsElement: React.FC<props> = ({ chat }) => {
  const userId = useSelector((state: IRoot) => state.auth.user?._id);

  return (
    <div className={styles.chatElement}>
      <div className={styles.avatar}>
        <div style={{ position: "relative" }}>
          <img
            className={styles.userPhoto}
            src={chat.member.avatar}
            alt="friend avatar"
          />
          <div className={styles.statusDot}>
            {chat.member.online && (
              <i className={`fas fa-circle ${styles.statusDot}`}></i>
            )}
          </div>
        </div>
      </div>
      <div className={styles.messageInfo}>
        <div className={styles.userInfo}>
          {chat.member.name} {chat.member.surname}
          {userId !== chat.lastMessage.author_id && !chat.lastMessage.seen && (
            <div className={styles.messageUnseenDot}></div>
          )}
        </div>
        <div className={styles.lastMessageText}>
          {chat.lastMessage.author_id === userId && "Ty: "}
          {chat.lastMessage.text}
        </div>
        <div className={styles.messageDate}>
          {formatDistance(new Date(chat.updated_at), new Date(), {
            locale: pl,
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatsElement;
