import React from "react";
import { useDispatch } from "react-redux";
import { addChatByFriendId } from "../../../../../store/actions/messangerActions";
import { IFriend } from "../../../../../store/reducers/friendsReducer";
import styles from "./friend.module.scss";

type props = {
  friend: IFriend;
};

const Friend: React.FC<props> = ({ friend }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={styles.friendContainer}
      onClick={() => dispatch(addChatByFriendId(friend._id))}
    >
      <div className={styles.userInfo}>
        <img
          className={styles.friendPhoto}
          src={friend.avatar}
          alt="friend avatar"
        />
        {friend.name} {friend.surname}
      </div>
      <div className={styles.statusDot}>
        {friend.online && (
          <i
            className={`fas fa-circle ${styles.statusDot} ${styles.statusDotActive}`}
          ></i>
        )}
      </div>
    </div>
  );
};

export default Friend;
