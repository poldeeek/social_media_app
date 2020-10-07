import React, { useEffect, useRef, useState } from "react";
import styles from "./notificationPanel.module.scss";
import { useSocket } from "../../../../../contexts/socketProvider";
import { IIconParams } from "./notificationPanel";
import Invitations from "../../../invitations/invitations";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../../../store/reducers/rootReducer";
import { setNotification } from "../../../../../store/actions/notificationsActions";

const InvitationIcon: React.FC<IIconParams> = ({ active, changeActive }) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const inviationRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(
    inviationRef,
    () => active === "invitations" && changeActive("")
  );

  const notification = useSelector(
    (state: IRoot) => state.notifications.invitations
  );
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    if (socket === null) return;
    socket.on("invitation", (msg: string) => {
      currentUser &&
        dispatch(setNotification("invitations", true, currentUser._id));
    });
  }, [socket]);

  const seeInvitationsHandler = () => {
    notification &&
      currentUser &&
      dispatch(setNotification("invitations", false, currentUser._id));
  };

  return (
    <div ref={inviationRef} onClick={() => seeInvitationsHandler()}>
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
