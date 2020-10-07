import React from "react";
import styles from "../profile.module.scss";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { useParams } from "react-router";
import { IRouterParams } from "../profile";
import { api, authenticationHeader } from "../../../../config/apiHost";

type buttonProps = {
  isFriend?: boolean;
  heInvited?: boolean;
  meInvited?: boolean;
  changeFriendshipStatus: (
    isFriend: boolean,
    heInvited: boolean,
    meInvited: boolean
  ) => void;
};

const FriendshipStatusButton: React.FC<buttonProps> = ({
  isFriend,
  meInvited,
  heInvited,
  changeFriendshipStatus,
}) => {
  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);
  const { id } = useParams<IRouterParams>();

  const sendInvitation = () => {
    api
      .post(
        `http://localhost:5000/api/invitations/sendInvitation/${id}`,
        {
          _id: currentUserId,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => changeFriendshipStatus(false, false, true))
      .catch((err) => console.log(err));
  };

  const acceptInvitation = () => {
    api
      .post(
        `http://localhost:5000/api/friends/addFriend/${id}`,
        {
          _id: currentUserId,
          type: "invitation_accept",
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => changeFriendshipStatus(true, false, false))
      .catch((err) => console.log(err));
  };

  const rejectInvitation = () => {
    api
      .post(
        `http://localhost:5000/api/invitations/rejectInvitation/${id}`,
        {
          _id: currentUserId,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => changeFriendshipStatus(false, false, false))
      .catch((err) => console.log(err));
  };

  const cancelInvitation = () => {
    api
      .post(
        `http://localhost:5000/api/invitations/cancelInvitation/${currentUserId}`,
        {
          _id: id,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => changeFriendshipStatus(false, false, false))
      .catch((err) => console.log(err.response));
  };

  const removeFriend = () => {
    api
      .post(
        `http://localhost:5000/api/friends/removeFriend/${id}`,
        {
          _id: currentUserId,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => changeFriendshipStatus(false, false, false))
      .catch((err) => console.log(err));
  };

  if (isFriend)
    return (
      <div className={styles.button} onClick={() => removeFriend()}>
        <i className="fas fa-user-plus"></i> Usuń ze znajomych
      </div>
    );

  if (meInvited)
    return (
      <div className={styles.button} onClick={() => cancelInvitation()}>
        <i className="fas fa-user-plus"></i> Anuluj zaproszenie
      </div>
    );

  if (heInvited)
    return (
      <>
        <div className={styles.button} onClick={() => acceptInvitation()}>
          <i className="fas fa-user-check"></i> Akceptuj zaproszenie
        </div>
        <div className={styles.button} onClick={() => rejectInvitation()}>
          <i className="fas fa-user-times"></i> Odrzuć zaproszenie
        </div>
      </>
    );

  return (
    <div className={styles.button} onClick={() => sendInvitation()}>
      <i className="fas fa-user-plus"></i> Wyślij zaproszenie
    </div>
  );
};

export default FriendshipStatusButton;
