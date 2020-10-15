import React, { useState, useEffect } from "react";
import styles from "./friends.module.scss";
import Friend from "./friend/friend";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import {
  changeFriendStatus,
  loadFriends,
} from "../../../store/actions/friendsActions";
import { IFriend } from "../../../store/reducers/friendsReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { useSocket } from "../../../contexts/socketProvider";

const Friends: React.FC = () => {
  const socket = useSocket();
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const friendsState = useSelector((state: IRoot) => state.friends);
  const [modifyFriendsArray, setModifyFriendsArray] = useState<IFriend[]>([]);

  const dispatch = useDispatch();

  const searchingUser: Function = (name: string) => {
    console.log(name);
    if (name === "") {
      setModifyFriendsArray(friendsState.friends);
    }
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on("online", (msg: string) =>
      dispatch(changeFriendStatus(msg, true))
    );
    socket.on("offline", (msg: string) =>
      dispatch(changeFriendStatus(msg, false))
    );
  }, [socket]);

  useEffect(() => {
    currentUser && dispatch(loadFriends(currentUser._id));
    searchingUser("");
  }, []);
  useEffect(() => setModifyFriendsArray(friendsState.friends));

  return (
    <div className={styles.friendsContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`}></i>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Szukaj..."
        onChange={(e) => searchingUser(e.target.value)}
      />

      <div className={styles.friendList}>
        {friendsState.loading ? (
          <div className={styles.spinner}>
            <ClipLoader color={"#276a39"} />
          </div>
        ) : (
          modifyFriendsArray &&
          modifyFriendsArray.map((user: IFriend) => (
            <Friend key={user._id} user={user} />
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
