import React, { useState } from "react";
import styles from "./iconsPanel.module.scss";
import { useDispatch } from "react-redux";
import { signOut } from "../../../../../store/actions/authActions";

const IconsPanel: React.FC = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  const changeActive = (value: string) => {
    if (active == value) {
      setActive("");
      return;
    }
    setActive(value);
  };

  return (
    <div className={styles.iconsPanelContainer}>
      <div className={styles.firstIcons}>
        <div
          className={
            active == "invites"
              ? `${styles.icon} ${styles.iconActive}`
              : styles.icon
          }
          title="Zaproszenia do znajmoych"
          onClick={() => changeActive("invites")}
        >
          <i className="fas fa-envelope"></i>
        </div>
        <div
          className={
            active == "messages"
              ? `${styles.icon} ${styles.iconActive}`
              : styles.icon
          }
          title="Wiadomości"
          onClick={() => changeActive("messages")}
        >
          <i className="fas fa-comments"></i>
        </div>
        <div
          className={
            active == "notifications"
              ? `${styles.icon} ${styles.iconActive}`
              : styles.icon
          }
          title="Powiadomienia"
          onClick={() => changeActive("notifications")}
        >
          <i className="fas fa-bell"></i>
        </div>
      </div>
      <div className={styles.icon} onClick={() => dispatch(signOut())}>
        <i className="fas fa-sign-out-alt" title="Wyloguj"></i>
      </div>
    </div>
  );
};

export default IconsPanel;
