import React, { useState, useEffect } from "react";
import styles from "./search.module.scss";
import SearchingUser, { ISearchingUser } from "./searchingUser/searchingUser";

const Search: React.FC = () => {
  useEffect(() => {
    searchingUser("");
  }, []);

  const searchingUser: Function = (name: string) => {
    if (name == "") {
      setModifyFriendsArray(originalFriendsArray);
    }
  };

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
    <div className={styles.searchContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`}></i>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Szukaj..."
        onChange={(e) => searchingUser(e.target.value)}
      />

      <div className={styles.usersList}>
        {modifyFriendsArray.map((user: ISearchingUser) => {
          return <SearchingUser key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
};

export default Search;
