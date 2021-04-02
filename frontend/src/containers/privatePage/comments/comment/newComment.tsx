import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../../store/reducers/rootReducer";
import styles from "./comment.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import { api, authenticationHeader } from "../../../../config/apiHost";
import { IComment } from "../comments";

type newCommentProps = {
  post_author: string;
  post_id: string;
  addNewComment: (comment: IComment) => void;
};

const NewComment: React.FC<newCommentProps> = ({
  post_author,
  post_id,
  addNewComment,
}) => {
  const user = useSelector((state: IRoot) => state.auth.user);

  const [text, setText] = useState("");

  const onChangeHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      addComent();
      setText("");
    }
  };

  const addComent = () => {
    if (!text || text === "") return;
    user &&
      api
        .post(
          `http://localhost:5000/api/comments/addComment/${post_id}`,
          {
            author_id: user._id,
            text: text.trim(),
            user_id: post_author,
            type: "comment",
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          let newComment = resp.data.comment;
          newComment.author_id = {
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            surname: user.surname,
          };
          addNewComment(newComment);
        })
  };

  return (
    user && (
      <div className={styles.newComment}>
        <img src={user.avatar} alt="user avatar" />
        <TextareaAutosize
          autoFocus
          className={styles.editorInput}
          placeholder="Napisz komentarz..."
          onChange={(e) => setText(e.target.value)}
          onKeyUp={(e) => onChangeHandler(e)}
          value={text}
        />
        <i className="fas fa-paper-plane" onClick={() => addComent()}></i>
      </div>
    )
  );
};

export default NewComment;
