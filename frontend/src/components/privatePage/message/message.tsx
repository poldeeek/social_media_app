import React from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./message.module.scss";
import format from "date-fns/format";
import { pl } from "date-fns/locale";

interface IAuthor {
  _id: string;
  avatar: string;
  name: string;
  surname: string;
}

export interface IMessage {
  _id: string;
  chat_id: string;
  author_id: IAuthor;
  text: string;
  photo?: string;
  seen: boolean;
  updated_at: string;
}

type IProps = {
  message: IMessage;
};

const Message: React.FC<IProps> = ({ message }) => {
  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);

  if (currentUserId !== message.author_id._id) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.userAvatar}>
          <img src={message.author_id.avatar} alt="user avatar" />
        </div>
        <div className={styles.textInfo}>
          <div className={styles.userName}>{message.author_id.name}</div>
          <div className={styles.text}> {message.text}</div>
          <div className={styles.dateInfo}>{message.updated_at}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          className={`${styles.messageContainer} ${styles.messageContainerCurrentUser}`}
        >
          <div className={`${styles.textInfo} ${styles.textInfoCurrentUser}`}>
            <div className={`${styles.text} ${styles.textCurrentUser}`}>
              {message.text}
            </div>
            <div className={`${styles.dateInfo} ${styles.dateInfoCurrentUser}`}>
              {format(new Date(message.updated_at), "MM/dd/yyyy H:m ")}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Message;
