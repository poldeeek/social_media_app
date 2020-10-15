import React from "react";
import styles from "./bells.module.scss";
import { IBell } from "./bells";
import { NavLink } from "react-router-dom";

type BellProps = {
  notification: IBell;
  currentUserId: string;
};

const Bell: React.FC<BellProps> = ({ notification, currentUserId }) => {
  const renderMessage = () => {
    if (notification.type === "like") return " lubi twoją aktywność.";
    if (notification.type === "comment") return " skomentował twój post.";
    if (notification.type === "invitation_accept")
      return " zaakceptował twoje zaproszenie.";
  };

  return (
    <NavLink
      to={
        notification.type === "invitation_accept"
          ? `/profile/${notification.who_id._id}`
          : `/posts/${notification.object_id}`
      }
    >
      <div className={styles.bellContainer}>
        <img src={notification.who_id.avatar} alt="avatar" />
        <div style={{ width: "100%" }}>
          <div className={styles.bellMessage}>
            <b>
              {notification.who_id.name} {notification.who_id.surname}
            </b>
            {renderMessage()}
          </div>
          <div className={styles.dateInfo}>{notification.updated_at}</div>
        </div>
      </div>
    </NavLink>
  );
};

export default Bell;
