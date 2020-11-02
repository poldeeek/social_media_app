import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../../config/apiHost";
import styles from "./profile.module.scss";
import { authenticationHeader } from "../../../config/apiHost";
import ProfilePosts from "./profilePosts/profilePosts";
import ProfileFriends from "./profileFriends/profileFriends";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import FriendshipStatusButton from "./friendshipStatusButton/friendshipStatusButton";
import { IChat } from "../../../store/reducers/chatsReducers";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import { addChatByChatObject } from "../../../store/actions/messangerActions";
import { ClipLoader } from "react-spinners";
import EditProfile from "../editProfile/editProfile";

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
  const dispatch = useDispatch();
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const [showEditProfile, setShowEditProfile] = useState(false);

  const { id } = useParams<IRouterParams>();

  const [user, setUser] = useState<IUserProfile | null>(null);

  const [loading, setLoading] = useState(false);

  // for NavLink to chat with user
  const [chat, setChat] = useState<IChat>();

  const [activeButton, setActiveButton] = useState("posts");

  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    // get User information
    api
      .get(`http://localhost:5000/api/users/${id}`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        if (mounted) {
          setUser(resp.data);

          // get chat information
          if (resp.data.isFriend) {
            api
              .get(
                `http://localhost:5000/api/chats/getChat/${id}?user_id=${currentUserId}`,
                {
                  headers: authenticationHeader(),
                }
              )
              .then((resp) => {
                if (mounted) {
                  setChat(resp.data);
                }
                setLoading(false);
              })
              .catch((err) => setLoading(false));
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => setLoading(false));

    return () => {
      setActiveButton("posts");
      setLoading(false);

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

  const generateEditProfileButton = () => {
    if (isDesktopOrLaptop) {
      return (
        user && (
          <div
            className={styles.button}
            onClick={() => setShowEditProfile(true)}
          >
            <i className="fas fa-user-edit"></i> Edytuj profil
          </div>
        )
      );
    } else {
      return (
        user && (
          <NavLink to={`/editProfile/${user._id}`}>
            <div className={styles.button}>
              <i className="fas fa-user-edit"></i> Edytuj profil
            </div>
          </NavLink>
        )
      );
    }
  };

  const genereteSendMessageButton = () => {
    if (isDesktopOrLaptop) {
      return (
        chat && (
          <div
            className={styles.button}
            onClick={() => dispatch(addChatByChatObject(chat))}
          >
            <i className="fas fa-paper-plane"></i> Wyślij wiadomość
          </div>
        )
      );
    } else {
      return (
        chat && (
          <NavLink
            to={{ pathname: `/friends/${chat._id}`, state: chat }}
            key={chat._id}
          >
            <div className={styles.button}>
              <i className="fas fa-paper-plane"></i> Wyślij wiadomość
            </div>
          </NavLink>
        )
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <ClipLoader color={"#276a39"} />
      </div>
    );
  } else {
    return (
      <div className={styles.profileContainer}>
        {showEditProfile && (
          <EditProfile close={() => setShowEditProfile(false)} />
        )}
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
          {currentUserId === id && generateEditProfileButton()}
          {currentUserId !== id && (
            <>
              {user?.isFriend && genereteSendMessageButton()}
              <FriendshipStatusButton
                isFriend={user?.isFriend}
                meInvited={user?.meInvited}
                heInvited={user?.heInvited}
                changeFriendshipStatus={(isFriend, heInvited, meInvited) =>
                  changeFriendshipStatus(isFriend, heInvited, meInvited)
                }
              />
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
  }
};

export default Profile;
