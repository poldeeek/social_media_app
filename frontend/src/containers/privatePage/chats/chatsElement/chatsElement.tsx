import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";

import React from "react";
import { IChat } from "../../../../store/reducers/chatsReducers";
import styles from "./chatsElement.module.scss";

type props = {
  chat: IChat;
};

const ChatsElement: React.FC<props> = ({ chat }) => {
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
        </div>
        <div className={styles.lastMessageText}>{chat.lastMessage.text}</div>
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
