import React, { useState, useEffect } from "react";
import styles from "./friends.module.scss";
import Friend, { IFriend } from "./friend/friend";

const Friends: React.FC = () => {
  const searchingUser: Function = (name: string) => {
    console.log(name);
    if (name == "") {
      setModifyFriendsArray(originalFriendsArray);
      console.log("gdf");
    }
  };

  useEffect(() => {
    searchingUser("");
  }, []);

  const [originalFriendsArray, setOriginalFriendsArray] = useState([
    { _id: 1, name: "lol1", surname: "ha" },
    { _id: 2, name: "lol2", surname: "ha" },
    { _id: 3, name: "lol3", surname: "ha" },
    { _id: 4, name: "lol4", surname: "ha" },
    { _id: 5, name: "lol5", surname: "ha" },
    { _id: 6, name: "lol6", surname: "ha" },
    { _id: 7, name: "lol7", surname: "ha" },
    { _id: 8, name: "lol8", surname: "ha" },
    { _id: 9, name: "lol9", surname: "ha" },
    { _id: 10, name: "lol10", surname: "ha" },
    { _id: 11, name: "lol5", surname: "ha" },
    { _id: 12, name: "lol5", surname: "ha" },
    { _id: 13, name: "lol5", surname: "ha" },
    { _id: 14, name: "lol5", surname: "ha" },
    { _id: 15, name: "lol5", surname: "ha" },
  ]);

  const [modifyFriendsArray, setModifyFriendsArray]: any = useState([]);

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
        {modifyFriendsArray.map((user: IFriend) => {
          return <Friend key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
};

export default Friends;
