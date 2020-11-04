import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory, useLocation } from "react-router";
import Backdrop from "../../../UI/backdrop/backdrop";
import styles from "./showImage.module.scss";

export interface IShowImage {
  photo: string;
  prevUrl: string;
}

const ShowImage: React.FC = () => {
  const { state } = useLocation<IShowImage>();
  const [showBackdrop, setShowBackdrop] = useState(true);
  const history = useHistory();

  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  if (!state || typeof state.photo == "undefined") {
    history.push("/");

    return <></>;
  }

  return (
    <>
      {isDesktopOrLaptop && (
        <Backdrop
          show={showBackdrop}
          close={() => history.push(state.prevUrl)}
        />
      )}
      {!isDesktopOrLaptop && (
        <i
          className={`fas fa-chevron-left ${styles.closeIcon}`}
          onClick={() => history.push(state.prevUrl)}
        ></i>
      )}
      <div className={styles.photo}>
        {isDesktopOrLaptop && (
          <i
            className={`fas fa-times ${styles.closeIcon}`}
            onClick={() => history.push(state.prevUrl)}
          ></i>
        )}
        <img src={state.photo} />
      </div>
    </>
  );
};

export default ShowImage;
