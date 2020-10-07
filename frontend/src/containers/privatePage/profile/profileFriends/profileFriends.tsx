import React, { useEffect, useState } from "react";
import styles from "./profileFriends.module.scss";
import { IRouterParams } from "../profile";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { api, authenticationHeader } from "../../../../config/apiHost";
import ProfileFriend from "./profileFriend";
import { NavLink } from "react-router-dom";

export interface IFriend {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
}

const ProfileFriends: React.FC<IRouterParams> = ({ id }) => {
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const [friendsArray, setFriendsArray] = useState<IFriend[]>([]);

  useEffect(() => {
    currentUser &&
      api
        .get(
          `http://localhost:5000/api/friends/getFriends/profile/${currentUser._id}`,
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          setFriendsArray(resp.data.friends);
        })
        .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h1>Znajomi</h1>
      <div className={styles.friendsList}>
        {friendsArray &&
          friendsArray.map((friend) => (
            <ProfileFriend friend={friend} key={friend._id} />
          ))}
      </div>
    </>
  );
};

export default ProfileFriends;
