import React, { useEffect } from "react";
import styles from "./privatePage.module.scss";
import { useMediaQuery } from "react-responsive";
import DesktopContainer from "./desktop/desktop";
import MoblieContainer from "./mobile/mobile";
import { BrowserRouter } from "react-router-dom";

import { initateSocket, disconnectSocket } from "../../config/socket";
import { useSelector } from "react-redux";
import { IRoot } from "../../store/reducers/rootReducer";
import Background from "../../components/privatePage/background/background";

const PrivatePage: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const userID = useSelector((state: IRoot) => state.auth.user?._id);

  // Init sockets for chat and to getting notifications from server
  useEffect(() => {
    initateSocket(userID);

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <div className={styles.privatePage}>
        <Background />
        <BrowserRouter>
          {isDesktopOrLaptop ? <DesktopContainer /> : <MoblieContainer />}
        </BrowserRouter>
      </div>
    </>
  );
};

export default PrivatePage;
