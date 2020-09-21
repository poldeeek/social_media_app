import React from "react";
import styles from "./navBar.module.scss";
import logo from "../../../../images/logo.svg";
import IconsPanel from "./iconsPanel/iconsPanel";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = () => {
  const currentUser = useSelector((state: IRoot) => state.auth.user);
  return (
    <>
      <div className={styles.back}></div>
      <div className={styles.navBar}>
        <div className={styles.logo}>
          <NavLink to="/">
            <div className={styles.logoLink}>
              <img src={logo} />
              <span>GreenSociety</span>
            </div>
          </NavLink>
        </div>
        <div className={styles.avatar}>
          {currentUser && (
            <NavLink to={`/profile/${currentUser._id}`}>
              <div className={styles.avatarFrame}>
                <img
                  className={styles.photo}
                  src={currentUser?.avatar}
                  alt="user avatar"
                />
                <span className={styles.name}>{currentUser.name}</span>
              </div>
            </NavLink>
          )}
        </div>
        <IconsPanel />
      </div>
    </>
  );
};

export default NavBar;
