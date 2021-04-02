import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { api, authenticationHeader } from "../../../config/apiHost";
import { signOut } from "../../../store/actions/authActions";
import styles from "./editProfile.module.scss";

const DeleteAcc: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const deleteAccount = () => {
    setLoading(true);
    api
      .delete(`http://localhost:5000/api/users/delete/me`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setLoading(false);
        dispatch(signOut());
      })
      .catch((resp) => setLoading(false));
  };

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
              onClick={() => deleteAccount()}
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
          {loading && <ClipLoader color={"#276a39"} />}
        </div>
      )}
    </div>
  );
};

export default DeleteAcc;
