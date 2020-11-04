import React, { useEffect, useState } from "react";
import styles from "./post.module.scss";
import { IPost } from "../posts";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import Comments from "../../comments/comments";
import { api, authenticationHeader } from "../../../../config/apiHost";
import { NavLink, useLocation } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import { pl } from "date-fns/locale";

const Post: React.FC<{
  post: IPost;
  likePostHandler: (action: string) => void;
}> = ({ post, likePostHandler }) => {
  //if I like the post
  const [likeActive, setLikeAcitve] = useState<boolean>();

  const [likeHandlerLoading, setLikeHandlerLoading] = useState(false);

  const [commentActive, setCommentActive] = useState(false);

  const currentUserId = useSelector((state: IRoot) => state.auth.user?._id);

  const location = useLocation();

  useEffect(() => {
    if (currentUserId && post.likes.includes(currentUserId))
      setLikeAcitve(true);
    else setLikeAcitve(false);
  }, []);

  const likeHanlder = () => {
    if (likeHandlerLoading) return;
    setLikeHandlerLoading(true);
    let action: string;
    if (likeActive) action = "unlike";
    else action = "like";

    currentUserId &&
      api
        .post(
          `http://localhost:5000/api/posts/${action}/${post._id}`,
          {
            who_id: currentUserId,
            user_id: post.author_id._id,
            type: "like",
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          likePostHandler(action);
          setLikeAcitve(!likeActive);
          setLikeHandlerLoading(false);
        })
        .catch((err) => setLikeHandlerLoading(false));
  };

  return (
    <div className={styles.post}>
      <div className={styles.userInfo}>
        <NavLink to={`/profile/${post.author_id._id}`}>
          <img src={post.author_id.avatar} alt="user avatar" />
        </NavLink>
        <div className={styles.userInfoLabel}>
          <NavLink to={`/profile/${post.author_id._id}`}>
            <div className={styles.userInfoName}>
              {post.author_id.name} {post.author_id.surname}
            </div>
          </NavLink>
          <div className={styles.userInfoPostDate}>
            {formatDistance(new Date(post.created_at), new Date(), {
              locale: pl,
            })}
          </div>
        </div>
      </div>
      <div className={styles.text}>{post.text}</div>
      {post.photo && (
        <NavLink
          to={{
            pathname: `/showImage`,
            state: { photo: post.photo, prevUrl: location.pathname },
          }}
        >
          <img src={post.photo} className={styles.postPhoto} alt="post pic" />
        </NavLink>
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
