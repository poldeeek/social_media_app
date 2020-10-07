import React, { useEffect, useState } from "react";
import styles from "./post.module.scss";
import { IPost } from "../posts";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import Comments from "../../comments/comments";
import { api, authenticationHeader } from "../../../../config/apiHost";

const Post: React.FC<{
  post: IPost;
  likePostHandler: (action: string) => void;
}> = ({ post, likePostHandler }) => {
  //if I like the post
  const [likeActive, setLikeAcitve] = useState<boolean>();

  const [commentActive, setCommentActive] = useState(false);

  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);

  useEffect(() => {
    if (currentUserId && post.likes.includes(currentUserId))
      setLikeAcitve(true);
    else setLikeAcitve(false);
  }, []);

  const likeHanlder = () => {
    let action: string;
    if (likeActive) action = "unlike";
    else action = "like";

    console.log(`http://localhost:5000/api/posts/${action}/${post._id}`);
    currentUserId &&
      api
        .post(
          `http://localhost:5000/api/posts/${action}/${post._id}`,
          {
            who_id: currentUserId,
            user_id: post.author_id,
            type: "like",
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          console.log(resp);
          likePostHandler(action);
          setLikeAcitve((prevState) => !prevState);
        })
        .catch((err) => console.log(err));
  };

  return (
    <div className={styles.post}>
      <div className={styles.userInfo}>
        <img src={post.author_id.avatar} alt="user avatar" />
        <div className={styles.userInfoLabel}>
          <div className={styles.userInfoName}>
            {post.author_id.name} {post.author_id.surname}
          </div>
          <div className={styles.userInfoPostDate}>{post.created_at}</div>
        </div>
      </div>
      <div className={styles.text}>{post.text}</div>
      {post.photo && (
        <img src={post.photo} className={styles.postPhoto} alt="post pic" />
      )}
      <div className={styles.interactionInfo}>
        <div className={styles.interactionButtons}>
          <div
            className={
              likeActive
                ? `${styles.button} ${styles.buttonActive}`
                : styles.button
            }
            onClick={() => likeHanlder()}
          >
            <i className={likeActive ? "fas fa-heart" : "far fa-heart"}></i>
          </div>{" "}
          <div
            className={
              commentActive
                ? `${styles.button} ${styles.buttonActive}`
                : styles.button
            }
            onClick={() => setCommentActive((prevState) => !prevState)}
          >
            <i
              className={commentActive ? "fas fa-comment" : "far fa-comment"}
            ></i>
          </div>
        </div>
        <div className={styles.likesInfo}>
          <i className="far fa-heart"></i> {post.likes.length}
        </div>
      </div>
      {commentActive && (
        <Comments post_id={post._id} post_author={post.author_id._id} />
      )}
    </div>
  );
};

export default Post;
