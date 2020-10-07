import React, { useState, useEffect } from "react";
import styles from "./comment.module.scss";
import { IComment } from "../comments";
import { api, authenticationHeader } from "../../../../config/apiHost";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";

type commentProps = {
  comment: IComment;
  likePostHandler: (action: string) => void;
};

const Comment: React.FC<commentProps> = ({ comment, likePostHandler }) => {
  const [likeActive, setLikeActive] = useState<boolean>();

  const currentUser = useSelector((state: IRoot) => state.auth.user);

  useEffect(() => {
    console.log(comment.likes);
    if (currentUser && comment.likes.includes(currentUser._id))
      setLikeActive(true);
    else setLikeActive(false);
  }, []);

  const likeHandler = () => {
    let action: string;
    if (likeActive) action = "unlike";
    else action = "like";

    currentUser &&
      api
        .post(
          `http://localhost:5000/api/comments/${action}/${comment._id}`,
          {
            user_id: currentUser._id,
            comment_author: comment.author_id._id,
            type: "like",
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          likePostHandler(action);
          setLikeActive((prevState) => !prevState);
        })
        .catch((err) => err.resposne);
  };

  return (
    <div className={styles.comment}>
      <div style={{ display: "flex" }}>
        <img src={comment.author_id.avatar} alt="user avatar" />
        <div className={styles.commentText}>
          <b style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
            {comment.author_id.name} {comment.author_id.surname}
          </b>
          {comment.text}
        </div>
      </div>
      <div className={styles.commentInfo}>
        <div className={styles.likes} onClick={() => likeHandler()}>
          <i
            style={{ marginRight: "0.3rem" }}
            className={likeActive ? "fas fa-heart" : "far fa-heart"}
          ></i>{" "}
          {comment.likes.length}
        </div>
        <div>{comment.created_at}</div>
      </div>
    </div>
  );
};

export default Comment;
