import React from "react";
import styles from "./moblieNavBar.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { signOut } from "../../../../store/actions/authActions";

const MoblieNavBar: React.FC = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: IRoot) => state.auth.user);

  return (
    <div className={styles.moblieNavBarContainer}>
      <NavLink exact to="/" activeClassName={styles.activeLink}>
        <div className={styles.icon}>L</div>
      </NavLink>
      <NavLink
        exact
        to={`/profile/${user?.id}`}
        activeClassName={styles.activeLink}
      >
        <div className={styles.icon}>
          <img src={user?.avatar} />
        </div>
      </NavLink>
      <NavLink exact to="/friends" activeClassName={styles.activeLink}>
        <div className={styles.icon}>
          <i className="fas fa-comments"></i>
        </div>
      </NavLink>
      <NavLink exact to="/search" activeClassName={styles.activeLink}>
        <div className={styles.icon}>
          <i className="fas fa-search"></i>
        </div>
      </NavLink>
      <NavLink exact to="/invitations" activeClassName={styles.activeLink}>
        <div className={styles.icon}>
          <i className="fas fa-envelope"></i>
        </div>
      </NavLink>
      <NavLink exact to="/notifications" activeClassName={styles.activeLink}>
        <div className={styles.icon}>
          <i className="fas fa-bell"></i>
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
