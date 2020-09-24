import React, { useEffect, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";

const InvitationIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const socket = useSocket();

  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (socket === null) return;

    socket.on("invitation", (msg: string) => {
      setNotification(true);
    });
  }, [socket]);

  return (
    <div
      className={
        active === "invitations"
          ? `${styles.icon} ${styles.iconActive}`
          : styles.icon
      }
      title="Zaproszenia do znajmoych"
      onClick={() => changeActive("invitations")}
    >
      <i className="fas fa-envelope"></i>
      {notification && <div className={styles.notificationDot}></div>}
    </div>
  );
};

export default InvitationIcon;
