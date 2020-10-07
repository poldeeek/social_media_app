import React, { useEffect } from "react";
import styles from "./privatePage.module.scss";
import { useMediaQuery } from "react-responsive";
import DesktopContainer from "./desktop/desktop";
import MoblieContainer from "./mobile/mobile";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../store/reducers/rootReducer";
import Background from "../../components/privatePage/background/background";
import { SocketProvider } from "../../contexts/socketProvider";
import { loadNotifications } from "../../store/actions/notificationsActions";

const PrivatePage: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const userID = useSelector((state: IRoot) => state.auth.user?._id);

  const dispatch = useDispatch();

  useEffect(() => {
    userID && dispatch(loadNotifications(userID));
  }, []);

  return (
    <SocketProvider userID={userID}>
      <div className={styles.privatePage}>
        <Background />
        <BrowserRouter>
          {isDesktopOrLaptop ? <DesktopContainer /> : <MoblieContainer />}
        </BrowserRouter>
      </div>
    </SocketProvider>
  );
};

export default PrivatePage;
