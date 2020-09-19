import React, { useState } from "react";
import styles from "./registerMobileForm.module.scss";
import Register from "./register/register";

const RegisterMobileForm: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className={styles.registerForm}>
      <div className={styles.joinUsText}>Dołącz do nas!</div>
      {!showRegister ? (
        <div className={styles.createAccArea}>
          <div
            className={styles.createAccAreaButton}
            onClick={() => setShowRegister((prev) => !prev)}
          >
            Stwórz konto
          </div>
        </div>
      ) : (
        <Register />
      )}
    </div>
  );
};

export default RegisterMobileForm;
