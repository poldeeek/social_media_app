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

  const [showMore, setShowMore] = useState(true);

  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [lastCommentDate, setLastCommentDate] = useState<string | null>(null);

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    setLoading(true);

    let url;
    if (lastCommentDate)
      url = `http://localhost:5000/api/comments/${post_id}?limit=${limit}&date=${lastCommentDate}`;
    else url = `http://localhost:5000/api/comments/${post_id}?limit=${limit}`;

    api
      .get(url, {
        headers: authenticationHeader(),
      })
      .then((resp) => {
        setComments((prevState) => [...prevState, ...resp.data]);
        if (resp.data.length < limit) setShowMore(false);
        setLastCommentDate(resp.data[resp.data.length - 1].updated_at);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const addNewComment = (addedComment: IComment) => {
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
      {showMore && (
        <div className={styles.showMoreButton} onClick={() => getComments()}>
          Pokaż więcej komentarzy
        </div>
      )}
    </div>
  );
};

export default Comments;
