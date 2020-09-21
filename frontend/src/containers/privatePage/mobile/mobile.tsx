import React from "react";
import { Switch, Route } from "react-router-dom";
import MoblieNavBar from "./navBar/moblieNavBar";
import Posts from "../posts/posts";
import Friends from "../friends/friends";
import Search from "../search/search";
import Profile from "../profile/profile";

const MoblieContainer: React.FC = () => {
  return (
    <>
      <MoblieNavBar />
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/invitations" render={() => <div>invitations</div>} />
        <Route path="/notifications" render={() => <div>notifications</div>} />
        <Route path="/friends" component={Friends} />
        <Route path="/search" component={Search} />
        <Route path="/friends/:id" render={() => <div>chat</div>} />
        <Route path="/profile/:id" component={Profile} />
      </Switch>
    </>
  );
};

export default MoblieContainer;