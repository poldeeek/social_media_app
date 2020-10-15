import React from "react";
import styles from "./friend.module.scss";
import { IFriend } from "../../../../store/reducers/friendsReducer";

type props = {
  user: IFriend;
};

const Friend: React.FC<props> = ({ user }) => {
  return (
    <div className={styles.friendContainer}>
      <div className={styles.userInfo}>
        <img
          className={styles.friendPhoto}
          src={user.avatar}
          alt="friend avatar"
        />
        {user.name} {user.surname}
      </div>
      <div className={styles.statusDot}>
        {user.online ? (
          <i
            className={`fas fa-circle ${styles.statusDot} ${styles.statusDotActive}`}
          ></i>
        ) : (
          <i className={`fas fa-circle ${styles.statusDot}`}></i>
        )}
      </div>
    </div>
  );
};

export default Friend;
