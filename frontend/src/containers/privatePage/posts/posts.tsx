import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./posts.module.scss";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import DesktopNewPost from "./desktopNewPost";
import { api, authenticationHeader } from "../../../config/apiHost";
import Post from "./post/post";
import ClipLoader from "react-spinners/ClipLoader";

interface IAuthor {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
}

export interface IPost {
  author_id: IAuthor;
  created_at: string;
  likes: string[];
  photo?: string;
  text: string;
  _id: string;
}

const Posts: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    minWidth: 1024,
  });

  const [showNewPost, setShowNewPost] = useState(false);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const addNewPost = (addedPost: IPost) => {
    console.log(addedPost);
    const newPosts = [...posts];
    newPosts.unshift(addedPost);
    console.log(newPosts);
    setPosts(newPosts);
  };

  const user = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    let mounted = true;
    api
      .get(
        `http://localhost:5000/api/posts/getPosts/${user?._id}?limit=${perPage}&page=${page}`,
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        if (mounted) {
          setPosts((prevState) => [...prevState, ...resp.data]);
          setLoading(false);
        }
      })
      .catch((err) => {
        mounted && setLoading(false);
      });

    return () => {
      mounted = false;
      return;
    };
  }, []);

  const likePostHandler = (action: string, i: number) => {
    if (!user?._id) return;

    let modifitedPost = { ...posts[i], likes: [...posts[i].likes] };
    if (action === "unlike") {
      const index = modifitedPost.likes.indexOf(user._id);
      modifitedPost.likes.splice(index, 1);
    } else if (action === "like") {
      modifitedPost.likes.push(user._id);
    }

    const newPosts = [...posts];
    newPosts[i] = { ...modifitedPost };

    setPosts(newPosts);
  };

  return (
    <div className={styles.postsContainer}>
      {showNewPost && (
        <DesktopNewPost
          closeNewPost={() => setShowNewPost(false)}
          addNewPost={(addedPost) => addNewPost(addedPost)}
        />
      )}
      <div className={styles.newPostButton}>
        <img src={user?.avatar} alt="user avatar" />
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
      {loading && <ClipLoader color={"#276a39"} />}
      {posts &&
        posts.map((post, i) => (
          <Post
            post={post}
            key={post._id}
            likePostHandler={(action) => likePostHandler(action, i)}
          />
        ))}
    </div>
  );
};

export default Posts;
