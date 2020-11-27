import React, { useEffect, useRef, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../../../store/reducers/rootReducer";
import { setNotification } from "../../../../../store/actions/notificationsActions";
import Bells from "../../../bells/bells";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";

const BellIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const bellRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(bellRef, () => active === "bell" && changeActive(""));

  const socket = useSocket();
  const dispatch = useDispatch();

  const notification = useSelector((state: IRoot) => state.notifications.bell);

  const currentUser = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    console.log(socket, "bell");
    if (socket === null) return;
    socket.on("bell", (msg: string) => {
      currentUser && dispatch(setNotification("bell", true, currentUser._id));
    });
  }, [socket]);

  const seeBellsHandler = () => {
    notification &&
      currentUser &&
      dispatch(setNotification("bell", false, currentUser._id));
  };

  return (
    <div ref={bellRef} onClick={() => seeBellsHandler()}>
      <div
        className={
          active === "bell"
            ? `${styles.icon} ${styles.iconActive}`
            : styles.icon
        }
        title="Powiadomienia"
        onClick={() => changeActive("bell")}
      >
        <i className="fas fa-bell"></i>
        {notification && <div className={styles.notificationDot}></div>}
      </div>
      {active === "bell" && <Bells />}
    </div>
  );
};

export default BellIcon;
