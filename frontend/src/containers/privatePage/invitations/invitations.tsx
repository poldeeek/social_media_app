import React, { useEffect, useState } from "react";
import styles from "./invitations.module.scss";
import Invitation from "./invitation";
import { api, authenticationHeader } from "../../../config/apiHost";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import ClipLoader from "react-spinners/ClipLoader";

interface IInvitingUser {
  avatar: string;
  _id: string;
  name: string;
  surname: string;
}

export interface IInvitation {
  seen: boolean;
  _id: string;
  user_id: IInvitingUser;
  invited_user_id: string;
  createdAt: string;
}

const Invitations: React.FC = ({}) => {
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const [loading, setLoading] = useState(true);

  const currentId = useSelector((state: IRoot) => state.auth.user?._id);

  const removeInv = (_id: string) => {
    const newInv = invitations.filter((inv) => inv._id !== _id);
    setInvitations(newInv);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(
        `http://localhost:5000/api/invitations/getInvitations/${currentId}?limit=${perPage}&page=${page}`,
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        setInvitations(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.invitationsContainer}>
      {loading ? (
        <div className={styles.loaderConatiner}>
          <ClipLoader color={"#276a39"} />
        </div>
      ) : (
        invitations &&
        (invitations.length === 0 ? (
          <div className={styles.noInvitationInfo}>
            Nie masz nowych zaproszeń.
          </div>
        ) : (
          invitations.map(
            (inv) =>
              currentId && (
                <Invitation
                  currentUserId={currentId}
                  inv={inv}
                  key={inv._id}
                  removeInv={removeInv}
                />
              )
          )
        ))
      )}
    </div>
  );
};

export default Invitations;
