import React from "react";
import { Switch, Route } from "react-router-dom";
import MoblieNavBar from "./navBar/moblieNavBar";
import Posts from "../posts/posts";
import Chats from "../chats/chats";
import Search from "../search/search";
import Profile from "../profile/profile";
import Invitations from "../invitations/invitations";
import MoblieNewPost from "../posts/moblieNewPost";
import Bells from "../bells/bells";
import ConversationHoc from "./hoc/conversationHoc";
import EditProfile from "../editProfile/editProfile";
const MoblieContainer: React.FC = () => {
  return (
    <>
      <MoblieNavBar />
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/newPost" component={MoblieNewPost} />
        <Route path="/invitations" component={Invitations} />
        <Route path="/bells" component={Bells} />
        <Route exact path="/friends" component={Chats} />
        <Route path="/search" component={Search} />
        <Route path="/editProfile/:id" component={EditProfile} />
        <Route path="/friends/:id" component={ConversationHoc} />
        <Route path="/profile/:id" component={Profile} />
      </Switch>
    </>
  );
};

export default MoblieContainer;
