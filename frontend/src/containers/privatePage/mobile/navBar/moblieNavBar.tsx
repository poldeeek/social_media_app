import React, { useEffect } from "react";
import styles from "./moblieNavBar.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { signOut } from "../../../../store/actions/authActions";
import { useSocket } from "../../../../contexts/socketProvider";
import { setNotification } from "../../../../store/actions/notificationsActions";

const MoblieNavBar: React.FC = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const bellNotification = useSelector(
    (state: IRoot) => state.notifications.bell
  );
  const invitationsNotification = useSelector(
    (state: IRoot) => state.notifications.invitations
  );
  const messagesNotification = useSelector(
    (state: IRoot) => state.notifications.messages
  );

  const user = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    const setSocket = () => {
      if (socket === null) return;

      socket.on(
        "new_message",
        (msg: string) =>
          user && dispatch(setNotification("bell", true, user._id))
      );

      socket.on("bell", (msg: string) => {
        user && dispatch(setNotification("bell", true, user._id));
      });

      socket.on("invitation", (msg: string) => {
        user && dispatch(setNotification("invitations", true, user._id));
      });
    };

    setSocket();
  }, [socket]);

  const seeNotificationHandler = (notification: string) => {
    user && dispatch(setNotification(notification, false, user._id));
  };

  return (
    <div className={styles.moblieNavBarContainer}>
      <NavLink exact to="/" activeClassName={styles.activeLink}>
        <div className={styles.icon}>D</div>
      </NavLink>
      <NavLink
        exact
        to={`/profile/${user?._id}`}
        activeClassName={styles.activeLink}
      >
        <div className={styles.icon}>
          <img src={user?.avatar} alt="user avatar" />
        </div>
      </NavLink>
      <NavLink
        exact
        to="/friends"
        activeClassName={styles.activeLink}
        onClick={() => seeNotificationHandler("messages")}
      >
        <div className={styles.icon}>
          <i className="fas fa-comments"></i>
          {messagesNotification && (
            <div className={styles.notificationDot}></div>
          )}
        </div>
      </NavLink>
      <NavLink exact to="/search" activeClassName={styles.activeLink}>
        <div className={styles.icon}>
          <i className="fas fa-search"></i>
        </div>
      </NavLink>
      <NavLink
        exact
        to="/invitations"
        activeClassName={styles.activeLink}
        onClick={() => seeNotificationHandler("invitations")}
      >
        <div className={styles.icon}>
          <i className="fas fa-envelope"></i>
          {invitationsNotification && (
            <div className={styles.notificationDot}></div>
          )}
        </div>
      </NavLink>
      <NavLink
        exact
        to="/bells"
        activeClassName={styles.activeLink}
        onClick={() => seeNotificationHandler("bell")}
      >
        <div className={styles.icon}>
          <i className="fas fa-bell"></i>
          {bellNotification && <div className={styles.notificationDot}></div>}
        </div>
      </NavLink>
      <div
        className={`${styles.icon} ${styles.iconLast}`}
        onClick={() => dispatch(signOut())}
      >
        <i className="fas fa-sign-out-alt"></i>
      </div>
    </div>
  );
};

export default MoblieNavBar;
