import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./profilePosts.module.scss";
import { IRouterParams } from "../profile";
import { IPost } from "../../posts/posts";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { useSelector } from "react-redux";
import { api, authenticationHeader } from "../../../../config/apiHost";
import Post from "../../posts/post/post";
import { useParams } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";

const ProfilePosts: React.FC = () => {
  const { id } = useParams<IRouterParams>();

  let mounted = true;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [perPage, setPerPage] = useState(5);

  const [fetchError, setFetchError] = useState("");

  const [lastPostDate, setLastPostDate] = useState<string | null>(null);

  // is any more posts in database
  const [hasMore, setHasMore] = useState(true);

  // ref to loading div
  const postLoader = useRef<HTMLDivElement>(null);

  const user = useSelector((state: IRoot) => state.auth.user);

  // getting posts from server
  const fetchPosts = () => {
    let url;
    if (lastPostDate)
      url = `http://localhost:5000/api/posts/getPosts/profile/${id}?limit=${perPage}&date=${lastPostDate}`;
    else
      url = `http://localhost:5000/api/posts/getPosts/profile/${id}?limit=${perPage}`;
    api
      .get(url, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        if (mounted) {
          if (resp.data.length === 0) {
            setFetchError("");
            setHasMore(false);
            setPosts(resp.data);
            return;
          }

          setPosts((prevState) => [...prevState, ...resp.data]);
          if (resp.data.length < perPage) setHasMore(false);
          setLastPostDate(resp.data[resp.data.length - 1].created_at);
          setFetchError("");
        }
      })
      .catch((err) => setFetchError("Problem z pobraniem postów."));
  };

  // clean all states
  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setLastPostDate(null);
    return () => {
      mounted = false;
      return;
    };
  }, [id]);

  // getting posts from server at first time
  useEffect(() => {
    hasMore && !lastPostDate && fetchPosts();
  }, [lastPostDate, hasMore]);

  //infinity scroll - intersection observer callback function
  const loadMore = useCallback(
    (entries) => {
      const target = entries.find(
        (element: IntersectionObserverEntry) =>
          element.target.id === "postLoader"
      );
      if (target.isIntersecting && hasMore && lastPostDate) {
        fetchPosts();
      }
    },
    [hasMore, lastPostDate, fetchPosts]
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
    <>
      <h1>Posty</h1>
      <div className={styles.postsList}>
        {posts &&
          posts.map((post: IPost, i) => (
            <Post
              key={post._id}
              post={post}
              likePostHandler={(action) => likePostHandler(action, i)}
            />
          ))}
      </div>
      <div id="postLoader" ref={postLoader}>
        {hasMore && <ClipLoader color={"#276a39"} />}
      </div>
      {fetchError && <div style={{ color: "#D22E2E" }}>{fetchError}</div>}
    </>
  );
};

export default ProfilePosts;
