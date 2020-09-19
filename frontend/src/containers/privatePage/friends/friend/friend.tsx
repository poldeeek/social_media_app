import React from "react";
import styles from "./friend.module.scss";
import photo from "../../../../images/avatar.jpg";

export interface IFriend {
  _id: number;
  name: string;
  surname: string;
}

type props = {
  user: IFriend;
};

const Friend: React.FC<props> = ({ user }) => {
  return (
    <div className={styles.friendContainer}>
      <img className={styles.friendPhoto} src={photo} alt="friend avatar" />
      {user.name} {user.surname}
    </div>
  );
};

export default Friend;
