import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import NewPost from "./newPost";
import styles from "./posts.module.scss";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";

const Posts: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const [showNewPost, setShowNewPost] = useState(false);

  const [posts, setPosts] = useState([]);

  const user = useSelector((state: IRoot) => state.auth.user);

  console.log(isDesktopOrLaptop);

  return (
    <div className={styles.postsContainer}>
      {showNewPost && <NewPost closeNewPost={() => setShowNewPost(false)} />}
      <div className={styles.newPostButton}>
        <img src={user?.avatar} />
        {isDesktopOrLaptop ? (
          <div
            className={styles.buttonInput}
            onClick={() => setShowNewPost(true)}
          >
            Cześć {user?.name}, co słychać ?
          </div>
        ) : (
          <NavLink to="/newPost">
            <div className={styles.buttonInput}>
              Cześć {user?.name}, co słychać ?
            </div>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Posts;
