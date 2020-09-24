import React, { useState } from "react";
import styles from "./invitations.module.scss";
import avatar from "../../../images/avatar.jpg";
import Invitation from "./invitation";

const Invitations: React.FC = () => {
  const [invitations, setInvitations] = useState([
    { _id: "1", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "2", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "3", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "4", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "5", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "6", name: "Paweł", surname: "Polak", avatar: avatar },
    { _id: "7", name: "Paweł", surname: "Polak", avatar: avatar },
  ]);

  return (
    <div className={styles.invitationsContainer}>
      {invitations &&
        invitations.map((inv) => <Invitation user={inv} key={inv._id} />)}
    </div>
  );
};

export default Invitations;
