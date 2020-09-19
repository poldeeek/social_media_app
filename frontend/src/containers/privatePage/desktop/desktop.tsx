import React from "react";
import styles from "./desktop.module.scss";
import { Switch, Route } from "react-router-dom";
import NavBar from "./navBar/navBar";
import DesktopMain from "./main/desktopMain";
import Friends from "../friends/friends";
import Posts from "../posts/posts";
import Search from "../search/search";
import Profile from "../profile/profile";

const DesktopContainer: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className={styles.desktopContainer}>
        <Search />
        <div className={styles.center}>
          <Switch>
            <Route exact path="/" component={Posts} />
            <Route path="/profile/:id" component={Profile} />
          </Switch>
        </div>
        <Friends />
      </div>
    </>
  );
};

export default DesktopContainer;
