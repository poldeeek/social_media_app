import React, { useEffect, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";

const NotificationIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const socket = useSocket();

  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (socket === null) return;

    socket.on("notification", () => setNotification(true));
  });

  return (
    <div
      className={
        active === "notifications"
          ? `${styles.icon} ${styles.iconActive}`
          : styles.icon
      }
      title="Powiadomienia"
      onClick={() => changeActive("notifications")}
    >
      <i className="fas fa-bell"></i>
    </div>
  );
};

export default NotificationIcon;
