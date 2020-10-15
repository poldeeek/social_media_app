import React from "react";
import styles from "./profileFriends.module.scss";
import { IFriend } from "./profileFriends";
import { NavLink } from "react-router-dom";

type ProfileFriendType = {
  friend: IFriend;
};

const ProfileFriend: React.FC<ProfileFriendType> = ({ friend }) => {
  return (
    <div className={styles.profileFriend}>
      <NavLink to={`/profile/${friend._id}`} className={styles.link}>
        <img src={friend.avatar} alt="user avatar" />
        <div className={styles.friendInfo}>
          <div>{friend.surname}</div>
          <div>{friend.name}</div>
        </div>
      </NavLink>
    </div>
  );
};

export default ProfileFriend;
