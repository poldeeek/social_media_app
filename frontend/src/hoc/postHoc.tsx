import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { api, authenticationHeader } from "../config/apiHost";
import Post from "../containers/privatePage/posts/post/post";
import { IPost } from "../containers/privatePage/posts/posts";
import { IRoot } from "../store/reducers/rootReducer";

export interface IRouterParams {
  id: string;
}
const PostHoc: React.FC = () => {
  const { id } = useParams<IRouterParams>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: IRoot) => state.auth.user);

  const likePostHandler = (action: string) => {
    if (!user?._id) return;
    if (!post) return;

    let modifitedPost = { ...post, likes: [...post.likes] };
    if (action === "unlike") {
      const index = modifitedPost.likes.indexOf(user._id);
      modifitedPost.likes.splice(index, 1);
    } else if (action === "like") {
      modifitedPost.likes.push(user._id);
    }
    setPost({ ...modifitedPost });
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`http://localhost:5000/api/posts/getPost/${id}`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setPost(resp.data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError("Nie znaleziono postu.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ marginTop: "3rem" }}>
        <ClipLoader color={"#276a39"} />
      </div>
    );
  else
    return (
      <>
        {!post ? (
          <p style={{ color: "#D22E2E" }}>{error}</p>
        ) : (
          <Post
            post={post}
            likePostHandler={(action) => likePostHandler(action)}
          />
        )}
      </>
    );
};

export default PostHoc;
