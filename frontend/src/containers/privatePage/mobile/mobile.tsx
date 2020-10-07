import React from "react";
import { Switch, Route } from "react-router-dom";
import MoblieNavBar from "./navBar/moblieNavBar";
import Posts from "../posts/posts";
import Friends from "../friends/friends";
import Search from "../search/search";
import Profile from "../profile/profile";
import Invitations from "../invitations/invitations";
import MoblieNewPost from "../posts/moblieNewPost";
import Bells from "../bells/bells";

const MoblieContainer: React.FC = () => {
  return (
    <>
      <MoblieNavBar />
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/newPost" component={MoblieNewPost} />
        <Route path="/invitations" component={Invitations} />
        <Route path="/bells" component={Bells} />
        <Route path="/friends" component={Friends} />
        <Route path="/search" component={Search} />
        <Route path="/friends/:id" render={() => <div>chat</div>} />
        <Route path="/profile/:id" component={Profile} />
      </Switch>
    </>
  );
};

export default MoblieContainer;
