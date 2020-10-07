import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../../config/apiHost";
import styles from "./profile.module.scss";
import { authenticationHeader } from "../../../config/apiHost";
import ProfilePosts from "./profilePosts/profilePosts";
import ProfileFriends from "./profileFriends/profileFriends";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import FriendshipStatusButton from "./friendshipStatusButton/friendshipStatusButton";

interface IUserProfile {
  _id: string;
  avatar: string;
  email: string;
  name: string;
  surname: string;
  city: string;
  birth: string;
  createdAt: string;
  isFriend: boolean;
  heInvited: boolean;
  meInvited: boolean;
}

export interface IRouterParams {
  id: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<IRouterParams>();

  const [user, setUser] = useState<IUserProfile | null>(null);

  const [activeButton, setActiveButton] = useState("posts");

  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);

  useEffect(() => {
    let mounted = true;
    api
      .get(`http://localhost:5000/api/users/${id}`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        if (mounted) {
          setUser(resp.data);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      mounted = false;
      return;
    };
  }, [id]);

  // change friendship status after action in FriendshipStatusButton
  const changeFriendshipStatus = (
    isFriend: boolean,
    heInvited: boolean,
    meInvited: boolean
  ) => {
    user && setUser({ ...user, isFriend, heInvited, meInvited });
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        {user && <img src={user.avatar} alt="user profile" />}
        <div className={styles.info}>
          {user && (
            <p style={{ fontSize: "2.4rem" }}>
              {user.name} {user.surname}
            </p>
          )}
          {user && (
            <p style={{ fontWeight: "normal" }}>
              <i title="Miasto" className="fas fa-home"></i> {user.city}
            </p>
          )}
          {user && (
            <p style={{ fontWeight: "normal" }}>
              <i title="Data Urodzenia" className="fas fa-calendar-alt"></i>{" "}
              {user.birth}
            </p>
          )}
        </div>
      </div>
      <div className={styles.buttons}>
        {currentUserId !== id && (
          <>
            <FriendshipStatusButton
              isFriend={user?.isFriend}
              meInvited={user?.meInvited}
              heInvited={user?.heInvited}
              changeFriendshipStatus={(isFriend, heInvited, meInvited) =>
                changeFriendshipStatus(isFriend, heInvited, meInvited)
              }
            />
            <div className={styles.button}>
              <i className="fas fa-paper-plane"></i> Wyślij wiadomość
            </div>
          </>
        )}
        <div style={{ display: "flex", width: "calc(100% - 4.5rem)" }}>
          <div
            className={
              activeButton === "posts"
                ? `${styles.button} ${styles.buttonActive}`
                : styles.button
            }
            onClick={() => setActiveButton("posts")}
          >
            Posty
          </div>
          <div
            className={
              activeButton === "friends"
                ? `${styles.button} ${styles.buttonActive}`
                : styles.button
            }
            onClick={() => setActiveButton("friends")}
          >
            Znajomi
          </div>
        </div>
      </div>
      <div className={styles.userData}>
        {activeButton === "posts" ? (
          <ProfilePosts />
        ) : (
          <ProfileFriends id={id} />
        )}
      </div>
    </div>
  );
};

export default Profile;
