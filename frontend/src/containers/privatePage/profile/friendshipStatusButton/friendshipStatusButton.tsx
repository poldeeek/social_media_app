import React, { useState } from "react";
import styles from "../profile.module.scss";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { useParams } from "react-router";
import { IRouterParams } from "../profile";
import { api, authenticationHeader } from "../../../../config/apiHost";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [loading, setLoading] = useState(false);

  const sendInvitation = () => {
    if (!loading) {
      setLoading(true);
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
        .then((resp) => {
          changeFriendshipStatus(false, false, true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  const acceptInvitation = () => {
    if (!loading) {
      setLoading(true);
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
        .then((resp) => {
          changeFriendshipStatus(true, false, false);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  const rejectInvitation = () => {
    if (!loading) {
      setLoading(true);
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
        .then((resp) => {
          changeFriendshipStatus(false, false, false);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  const cancelInvitation = () => {
    if (!loading) {
      setLoading(true);
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
        .then((resp) => {
          changeFriendshipStatus(false, false, false);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  const removeFriend = () => {
    if (!loading) {
      setLoading(true);
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
        .then((resp) => {
          changeFriendshipStatus(false, false, false);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  if (isFriend)
    return (
      <div className={styles.button} onClick={() => removeFriend()}>
        {loading ? (
          <ClipLoader color={"#276a39"} />
        ) : (
          <>
            <i className="fas fa-user-plus"></i> Usuń ze znajomych{" "}
          </>
        )}
      </div>
    );

  if (meInvited)
    return (
      <div className={styles.button} onClick={() => cancelInvitation()}>
        {loading ? (
          <ClipLoader color={"#276a39"} />
        ) : (
          <>
            <i className="fas fa-user-plus"></i> Anuluj zaproszenie
          </>
        )}
      </div>
    );

  if (heInvited)
    return (
      <>
        <div className={styles.button} onClick={() => acceptInvitation()}>
          {loading ? (
            <ClipLoader color={"#276a39"} />
          ) : (
            <>
              <i className="fas fa-user-check"></i> Akceptuj zaproszenie
            </>
          )}
        </div>
        <div className={styles.button} onClick={() => rejectInvitation()}>
          {loading ? (
            <ClipLoader color={"#276a39"} />
          ) : (
            <>
              <i className="fas fa-user-times"></i> Odrzuć zaproszenie
            </>
          )}
        </div>
      </>
    );

  return (
    <div className={styles.button} onClick={() => sendInvitation()}>
      {loading ? (
        <ClipLoader color={"#276a39"} />
      ) : (
        <>
          <i className="fas fa-user-plus"></i> Wyślij zaproszenie
        </>
      )}
    </div>
  );
};

export default FriendshipStatusButton;
