import React, { useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useDispatch } from "react-redux";
import { signOut } from "../../../../../store/actions/authActions";
import InvitationIcon from "./invitationsIcon";
import NotificationIcon from "./bellIcon";
import MessagesIcon from "./messagesIcon";

export interface IIconParams {
  active: string;
  changeActive: (value: string) => void;
}

const NotificationPanel: React.FC = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  const changeActive = (value: string) => {
    console.log(value);
    if (active === value) {
      setActive("");
      return;
    }
    setActive(value);
  };

  return (
    <div className={styles.notificationPanelContainer}>
      <div className={styles.firstIcons}>
        <InvitationIcon
          active={active}
          changeActive={(value) => changeActive(value)}
        />
        <MessagesIcon
          active={active}
          changeActive={(value) => changeActive(value)}
        />
        <NotificationIcon
          active={active}
          changeActive={(value) => changeActive(value)}
        />
      </div>
      <div className={styles.icon} onClick={() => dispatch(signOut())}>
        <i className="fas fa-sign-out-alt" title="Wyloguj"></i>
      </div>
    </div>
  );
};

export default NotificationPanel;
