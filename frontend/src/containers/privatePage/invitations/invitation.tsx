import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IInvitation } from "./invitations";
import styles from "./invitations.module.scss";
import { api, authenticationHeader } from "../../../config/apiHost";
import ClipLoader from "react-spinners/ClipLoader";

const Invitation: React.FC<{
  inv: IInvitation;
  currentUserId: string;
  removeInv: (_id: string) => void;
}> = ({ inv, currentUserId, removeInv }) => {
  const [loading, setLoading] = useState(false);

  const acceptInvitation = () => {
    if (!loading) {
      setLoading(true);
      api
        .post(
          `http://localhost:5000/api/friends/addFriend/${inv.user_id._id}`,
          {
            _id: currentUserId,
            type: "invitation_accept",
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          removeInv(inv._id);
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
          `http://localhost:5000/api/invitations/rejectInvitation/${inv.user_id._id}`,
          {
            _id: currentUserId,
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          removeInv(inv._id);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  // check if user clicked on accpet/reject buttons or not
  const handleNavLinkClick = (event: any) => {

    // don't run NavLink if user clicked on buttons
    if (event.target.classList.contains(styles.button)) {
      event.preventDefault();
    }
  };

  return (
    <NavLink
      to={`/profile/${inv.user_id._id}`}
      onClick={(e) => handleNavLinkClick(e)}
    >
      <div className={styles.invitationContainer}>
        <div className={styles.invitationMessage}>
          <img src={inv.user_id.avatar} alt="user avatar" />

          <div className={styles.invitationInfo}>
            <b>
              {inv.user_id.name} {inv.user_id.surname}{" "}
            </b>
            wysłał ci zaproszenie do grona znajomych.
            <div className={styles.buttons}>
              {loading ? (
                <ClipLoader color={"#276a39"} />
              ) : (
                <>
                  <div
                    className={styles.button}
                    onClick={() => acceptInvitation()}
                  >
                    Akceptuj
                  </div>
                  <div
                    className={styles.button}
                    onClick={() => rejectInvitation()}
                  >
                    Odrzuć
                  </div>{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Invitation;
