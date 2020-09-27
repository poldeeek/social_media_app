import React, { useEffect, useRef, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";
import Invitations from "../../../invitations/invitations";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";

const InvitationIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const socket = useSocket();

  const [notification, setNotification] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => changeActive(""));

  useEffect(() => {
    if (socket === null) return;

    socket.on("invitation", (msg: string) => {
      setNotification(true);
    });
  }, [socket]);

  return (
    <div ref={ref}>
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
      {active === "invitations" && <Invitations />}
    </div>
  );
};

export default InvitationIcon;
