import React from "react";
import Invitations from "./invitations";
import styles from "./invitations.module.scss";

interface IInvitationProps {
  user: {
    _id: string;
    date?: Date;
    seen?: boolean;
    avatar: string;
    name: string;
    surname: string;
  };
}

const Invitation: React.FC<IInvitationProps> = ({ user }) => {
  return (
    <div className={styles.invitationContainer}>
      {user._id} {user.name}
    </div>
  );
};

export default Invitation;
