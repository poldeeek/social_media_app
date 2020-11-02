import React, { useEffect, useState } from "react";
import styles from "./profileFriends.module.scss";
import { IRouterParams } from "../profile";
import { api, authenticationHeader } from "../../../../config/apiHost";
import ProfileFriend from "./profileFriend";
import ClipLoader from "react-spinners/ClipLoader";

export interface IFriend {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
}

const ProfileFriends: React.FC<IRouterParams> = ({ id }) => {
  const [friendsArray, setFriendsArray] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`http://localhost:5000/api/friends/getFriends/profile/${id}`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setFriendsArray(resp.data.friends);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);

  return (
    <>
      <h1>Znajomi</h1>
      <div className={styles.friendsList}>
        {loading && (
          <div className={styles.loaderContainer}>
            <ClipLoader color={"#276a39"} />
          </div>
        )}
        {friendsArray &&
          friendsArray.map((friend) => (
            <ProfileFriend friend={friend} key={friend._id} />
          ))}
      </div>
    </>
  );
};

export default ProfileFriends;
