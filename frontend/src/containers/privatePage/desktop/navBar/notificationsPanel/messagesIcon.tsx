import React, { useEffect, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";

const MessagesIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const socket = useSocket();

  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (socket === null) return;

    socket.on("new_message", () => setNotification(true));
  });

  return (
    <div
      className={
        active === "messages"
          ? `${styles.icon} ${styles.iconActive}`
          : styles.icon
      }
      title="Wiadomości"
      onClick={() => changeActive("messages")}
    >
      <i className="fas fa-comments"></i>
    </div>
  );
};

export default MessagesIcon;
