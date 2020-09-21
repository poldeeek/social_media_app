import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAccessToken } from "../../../accessToken";
import { api } from "../../../config/apiHost";
import styles from "./profile.module.scss";
import { authenticationHeader } from "../../../config/apiHost";
import ProfilePosts from "./profilePosts/profilePosts";
import ProfileFriends from "./profileFriends/profileFriends";

interface IUserProfile {
  _id: string;
  avatar: string;
  email: string;
  name: string;
  surname: string;
  city: string;
  birth: string;
  createdAt: string;
}

export interface IRouterParams {
  id: string;
}

const Profile: React.FC = () => {
  const { id } = useParams<IRouterParams>();

  const [user, setUser] = useState<IUserProfile | null>(null);

  const [activeButton, setActiveButton] = useState("posts");

  useEffect(() => {
    api
      .get(`http://localhost:5000/api/users/${id}`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setUser(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(user);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        {user && <img src={user.avatar} alt="user profile photo" />}
        <div className={styles.info}>
          {user && (
            <p>
              {user.name} {user.surname}
            </p>
          )}
          {user && (
            <p>
              <i title="Miasto" className="fas fa-home"></i> {user.city}
            </p>
          )}
          {user && (
            <p>
              <i title="Data Urodzenia" className="fas fa-calendar-alt"></i>{" "}
              {user.birth}
            </p>
          )}
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.button}>
          <i className="fas fa-user-plus"></i> Zaproś do znajomych
        </div>
        <div className={styles.button}>
          <i className="fas fa-paper-plane"></i> Wyślij wiadomość
        </div>
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
          <ProfilePosts id={id} />
        ) : (
          <ProfileFriends id={id} />
        )}
      </div>
    </div>
  );
};

export default Profile;