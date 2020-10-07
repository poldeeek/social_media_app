import React from "react";
import styles from "./searchingUser.module.scss";
import photo from "../../../../images/avatar.jpg";
import { NavLink } from "react-router-dom";

export interface ISearchingUser {
  _id: number;
  name: string;
  surname: string;
  avatar: string;
}

type props = {
  user: ISearchingUser;
};

const SearchingUser: React.FC<props> = ({ user }) => {
  return (
    <NavLink to={`/profile/${user._id}`}>
      <div className={styles.searchingUserContainer}>
        <img
          className={styles.friendPhoto}
          src={user.avatar}
          alt="friend avatar"
        />
        {user.surname} {user.name}
      </div>
    </NavLink>
  );
};

export default SearchingUser;
