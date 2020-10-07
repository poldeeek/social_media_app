import React, { useEffect } from "react";
import styles from "./App.module.scss";
import PublicPage from "./publicPage/publicPage";
import PrivatePage from "./privatePage/privatePage";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../store/actions/authActions";
import { IRoot } from "../store/reducers/rootReducer";

const App: React.FC = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state: IRoot) => state.auth.isLoading);
  const isAuthenticated = useSelector(
    (state: IRoot) => state.auth.isAuthenticated
  );

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={styles.App}>
        {isAuthenticated ? <PrivatePage /> : <PublicPage />}
      </div>
    );
  }
};

export default App;
