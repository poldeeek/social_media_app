import React from "react";
import styles from "./profilePosts.module.scss";
import { IRouterParams } from "../profile";

const ProfilePosts: React.FC<IRouterParams> = ({ id }) => {
  return <div>{id}p</div>;
};

export default ProfilePosts;
