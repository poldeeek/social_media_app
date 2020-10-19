import React, { useState, useEffect } from "react";
import styles from "./friends.module.scss";
import Friend from "./friend/friend";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import ClipLoader from "react-spinners/ClipLoader";
import { useSocket } from "../../../../contexts/socketProvider";
import {
  changeFriendStatus,
  loadFriends,
  removeFriend,
  addFriend,
} from "../../../../store/actions/friendsActions";
import { IFriend } from "../../../../store/reducers/friendsReducer";
import useDebounce from "../../../../hooks/useDebounce";

const Friends: React.FC = () => {
  const socket = useSocket();
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const friends = useSelector((state: IRoot) => state.friends);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const dispatch = useDispatch();

  useEffect(() => {
    if (socket === null) return;
    socket.on("online", (msg: string) =>
      dispatch(changeFriendStatus(msg, true))
    );
    socket.on("offline", (msg: string) =>
      dispatch(changeFriendStatus(msg, false))
    );
    socket.on("friend-removed", (msg: string) => dispatch(removeFriend(msg)));
    socket.on("friend-added", (msg: string) => dispatch(addFriend(msg)));
  }, [socket]);

  useEffect(() => {
    currentUser && dispatch(loadFriends(currentUser._id, debouncedSearchTerm));
  }, [debouncedSearchTerm]);

  return (
    <div className={styles.friendsContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`}></i>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Szukaj..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      <div className={styles.friendList}>
        {friends && friends.loading ? (
          <div className={styles.spinner}>
            <ClipLoader color={"#276a39"} />
          </div>
        ) : (
          friends &&
          friends.friends.map((friend: IFriend) => (
            <Friend key={friend._id} friend={friend} />
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
