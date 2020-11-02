import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./editProfile.module.scss";

const DeleteAcc: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className={styles.deleteAccount}>
      <div
        className={styles.deleteAccountButton}
        onClick={() => setShowWarning(!showWarning)}
      >
        Usuń konto
      </div>
      {showWarning && (
        <div className={styles.deleteAccountWarning}>
          Na pewno chcesz usunąć konto ?
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className={`${styles.deleteAccountWarningButton} ${styles.deleteAccountWarningButtonYes}`}
            >
              Tak
            </div>
            <div
              className={`${styles.deleteAccountWarningButton} ${styles.deleteAccountWarningButtonNo}`}
              onClick={() => setShowWarning(false)}
            >
              Nie
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAcc;
