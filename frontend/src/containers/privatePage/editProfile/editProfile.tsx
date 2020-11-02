import React, { useState } from "react";
import styles from "./editProfile.module.scss";
import ChangePhoto from "./changePhoto";
import ChangeBasic from "./changeBasic";
import ChangePassword from "./changePassword";
import ChangeEmail from "./changeEmail";
import DeleteAcc from "./deleteAcc";
import Backdrop from "../../../UI/backdrop/backdrop";
import { useMediaQuery } from "react-responsive";

const EditProfile: React.FC<{ close?: () => void }> = ({ close }) => {
  const [showBackdrop, setShowBackdrop] = useState(true);

  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });
  return (
    <>
      {isDesktopOrLaptop && close && (
        <Backdrop show={showBackdrop} close={() => close()} />
      )}
      <div className={styles.editProfileContainer}>
        {isDesktopOrLaptop && close && (
          <div className={styles.closeButton} onClick={() => close()}>
            <i className="fas fa-times"></i>
          </div>
        )}
        <h2>Edycja Profilu</h2>
        <ChangePhoto />
        <ChangeBasic />
        <ChangePassword />
        <ChangeEmail />
        <DeleteAcc />
      </div>
    </>
  );
};

export default EditProfile;
