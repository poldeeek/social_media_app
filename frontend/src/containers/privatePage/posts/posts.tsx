import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const user = useSelector((state: IRoot) => state.auth.user);

  const [showNewPost, setShowNewPost] = useState(false);

  let mounted = true;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const [fetchError, setFetchError] = useState("");

  const [lastPostDate, setLastPostDate] = useState<string | null>(null);

  // is any more posts in database
  const [hasMore, setHasMore] = useState(true);

  // ref to loading div
  const postLoader = useRef<HTMLDivElement>(null);

  // getting posts from server
  const fetchPosts = () => {
    setIsLoading(true);
    let url;
    if (lastPostDate)
      url = `http://localhost:5000/api/posts/getPosts/${user?._id}?limit=${perPage}&date=${lastPostDate}`;
    else
      url = `http://localhost:5000/api/posts/getPosts/${user?._id}?limit=${perPage}`;

    api
      .get(url, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        if (mounted) {
          if (resp.data.length === 0) {
            setIsLoading(false);
            setFetchError("");
            setHasMore(false);
            return;
          }
          setPosts((prevState) => [...prevState, ...resp.data]);
          if (resp.data.length < perPage) setHasMore(false);
          setLastPostDate(resp.data[resp.data.length - 1].created_at);
          setFetchError("");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setFetchError("Problem z pobraniem postów.");
          setIsLoading(false);
        }
      });
  };

  // getting posts from server with first render
  useEffect(() => {
    mounted = true;
    fetchPosts();

    return () => {
      mounted = false;
      return;
    };
  }, []);

  //infinity scroll - intersection observer callback function
  const loadMore = useCallback(
    (entries) => {
      const target = entries.find(
        (element: IntersectionObserverEntry) =>
          element.target.id === "postLoader"
      );
      if (target.isIntersecting && hasMore && lastPostDate && !isLoading) {
        fetchPosts();
      }
    },
    [hasMore, lastPostDate, fetchPosts, isLoading]
  );

  //infinity scroll - intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (postLoader && postLoader.current) observer.observe(postLoader.current);

    return () => {
      if (postLoader.current) observer.unobserve(postLoader.current);
    };
  }, [postLoader, loadMore]);

  const addNewPost = (addedPost: IPost) => {
    const newPosts = [...posts];
    newPosts.unshift(addedPost);
    setPosts(newPosts);
  };

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
      {posts &&
        posts.map((post, i) => (
          <Post
            post={post}
            key={post._id}
            likePostHandler={(action) => likePostHandler(action, i)}
          />
        ))}
      <div ref={postLoader} id="postLoader">
        {hasMore && <ClipLoader color={"#276a39"} />}
      </div>
      {fetchError && <div style={{ color: "#D22E2E" }}>{fetchError}</div>}
    </div>
  );
};

export default Posts;
