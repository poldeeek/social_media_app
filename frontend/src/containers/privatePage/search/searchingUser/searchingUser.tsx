import React from "react";
import styles from "./searchingUser.module.scss";
import photo from "../../../../images/avatar.jpg";

export interface ISearchingUser {
  _id: number;
  name: string;
  surname: string;
}

type props = {
  user: ISearchingUser;
};

const SearchingUser: React.FC<props> = ({ user }) => {
  return (
    <div className={styles.searchingUserContainer}>
      <img className={styles.friendPhoto} src={photo} alt="friend avatar" />
      {user.name} {user.surname}
    </div>
  );
};

export default SearchingUser;
