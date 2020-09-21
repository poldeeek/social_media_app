import React from "react";
import styles from "./profileFriends.module.scss";
import { IRouterParams } from "../profile";

const ProfileFriends: React.FC<IRouterParams> = ({ id }) => {
  return <div>{id}</div>;
};

export default ProfileFriends;
