import React, { useEffect, useState } from "react";
import styles from "./profilePosts.module.scss";
import { IRouterParams } from "../profile";
import { IPost } from "../../posts/posts";
import { IRoot } from "../../../../store/reducers/rootReducer";
import { useSelector } from "react-redux";
import { api, authenticationHeader } from "../../../../config/apiHost";
import Post from "../../posts/post/post";
import { useParams } from "react-router";

const ProfilePosts: React.FC = () => {
  const { id } = useParams<IRouterParams>();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const user = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    let mounted = true;
    api
      .get(
        `http://localhost:5000/api/posts/getPosts/profile/${id}?limit=${perPage}&page=${page}`,
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        if (mounted) {
          setPosts(resp.data);
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
  }, [id]);

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
    </>
  );
};

export default ProfilePosts;
