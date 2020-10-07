import React, { useEffect, useState } from "react";
import Comment from "./comment/comment";
import styles from "./comments.module.scss";
import NewComment from "../comments/comment/newComment";
import { api, authenticationHeader } from "../../../config/apiHost";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import ClipLoader from "react-spinners/ClipLoader";

interface IAuthorId {
  _id: string;
  avatar: string;
  name: string;
  surname: string;
}

export interface IComment {
  _id: string;
  author_id: IAuthorId;
  text: string;
  post_id: string;
  likes: string[];
  created_at: string;
}

const Comments: React.FC<{ post_id: string; post_author: string }> = ({
  post_id,
  post_author,
}) => {
  const currentUser = useSelector((state: IRoot) => state.auth.user);
  const [comments, setComments] = useState<IComment[]>([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    setLoading(true);
    api
      .get(`http://localhost:5000/api/comments/${post_id}?page=0&limit=5`, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setComments(resp.data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const addNewComment = (addedComment: IComment) => {
    console.log(addedComment);
    const newComments = [...comments];
    newComments.unshift(addedComment);
    setComments(newComments);
  };

  const likePostHandler = (action: string, i: number) => {
    if (!currentUser?._id) return;

    let modifitedComment = { ...comments[i], likes: [...comments[i].likes] };
    if (action === "unlike") {
      const index = modifitedComment.likes.indexOf(currentUser._id);
      modifitedComment.likes.splice(index, 1);
    } else if (action === "like") {
      modifitedComment.likes.push(currentUser._id);
    }

    const newComment = [...comments];
    newComment[i] = { ...modifitedComment };

    setComments(newComment);
  };

  return (
    <div className={styles.comments}>
      <NewComment
        post_id={post_id}
        addNewComment={(value) => addNewComment(value)}
        post_author={post_author}
      />
      {comments &&
        comments.map((comment, i) => (
          <Comment
            comment={comment}
            key={comment._id}
            likePostHandler={(action) => likePostHandler(action, i)}
          />
        ))}
      {loading && <ClipLoader color={"#276a39"} />}
    </div>
  );
};

export default Comments;
