import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./posts.module.scss";
import Backdrop from "../../../UI/backdrop/backdrop";

const NewPost: React.FC<{ closeNewPost: () => void }> = ({ closeNewPost }) => {
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  return (
    <div>
      <Backdrop show={true} close={() => closeNewPost()} />
      <div className={styles.createNewPost}>Utwórz post</div>
    </div>
  );
};
export default NewPost;
