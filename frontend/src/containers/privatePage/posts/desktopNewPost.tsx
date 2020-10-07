import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./posts.module.scss";
import Backdrop from "../../../UI/backdrop/backdrop";
import { v4 as uuidv4 } from "uuid";
import { api, authenticationHeader } from "../../../config/apiHost";
import ClipLoader from "react-spinners/ClipLoader";
import firebase, { storage } from "../../../config/firebase";
import { IPost } from "./posts";

const DesktopNewPost: React.FC<{
  closeNewPost: () => void;
  addNewPost: (value: IPost) => void;
}> = ({ closeNewPost, addNewPost }) => {
  const currentUser = useSelector((state: IRoot) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const [postText, setPostText] = useState("");
  const [postError, setPostError] = useState("");

  const [choosenPhotoUrl, setChoosenPhotoUrl] = useState<string | null>(null);
  const [choosenPhoto, setChoosenPhoto] = useState<File | null>(null);
  const [choosePhotoError, setChoosePhotoError] = useState("");

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setChoosePhotoError("");
        setChoosenPhoto(file);
        setChoosenPhotoUrl(URL.createObjectURL(file));
      } else {
        setChoosePhotoError("Zły format pliku!");
        setChoosenPhoto(null);
        setChoosenPhotoUrl(null);
      }
    }
  };

  const handlePostUpload = async () => {
    setLoading(true);
    if (postText === "") {
      await setPostError("Tekst nie może być pusty!");
      setLoading(false);
      return;
    }
    setPostError("");

    if (choosenPhoto) {
      const fileName = `${uuidv4()}`;
      const uploadTask = storage.ref(`images/${fileName}`).put(choosenPhoto);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        (err) => {
          setLoading(false);
          setPostError("Błąd wrzucenia zdjęcia.");
        },
        () => {
          storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              handleUpload(url);
            });
        }
      );
    } else {
      handleUpload(null);
    }
  };

  const handleUpload = (uploadedPhotoUrl: string | null) => {
    if (currentUser?._id) {
      setPostError("");

      api
        .post(
          `http://localhost:5000/api/posts/addPost/${currentUser._id}`,
          {
            text: postText,
            photo: uploadedPhotoUrl ? uploadedPhotoUrl : null,
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          let addedPost = resp.data.post;
          addedPost.author_id = {
            avatar: currentUser?.avatar,
            name: currentUser?.name,
            surname: currentUser?.surname,
            _id: currentUser?._id,
          };
          addNewPost(addedPost);
          closeNewPost();
        })
        .catch((err) => {
          setPostError("Błąd serwera.");
          setLoading(false);
        });
    } else {
      setPostError("Brak id użytkownika.");
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setChoosenPhotoUrl("");
    setChoosenPhoto(null);
  };

  return (
    <div>
      <Backdrop show={true} close={() => closeNewPost()} />
      <div className={styles.desktopNewPost}>
        <div>
          <i
            className={`fas fa-times ${styles.close}`}
            onClick={() => closeNewPost()}
          ></i>
        </div>
        <p>Utwórz post</p>
        <textarea
          className={styles.textArea}
          placeholder="Co słychać ?"
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <div className={styles.addPhoto}>
          <label htmlFor="post-photo-upload" className={styles.addPhotoLabel}>
            + <i className={`fas fa-camera ${styles.cameraIcon}`}></i>
          </label>
          <input
            id="post-photo-upload"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handlePhotoChange(e)}
          />
          <div className={styles.displayPhoto}>
            {choosenPhotoUrl && (
              <>
                <img src={choosenPhotoUrl} alt="choosen" />
                <i
                  className={`fas fa-times ${styles.removePhoto}`}
                  onClick={() => removePhoto()}
                ></i>
              </>
            )}
            <div className={styles.photoError}>{choosePhotoError}</div>
          </div>
        </div>
        <div
          className={styles.submitButton}
          onClick={() => !loading && handlePostUpload()}
        >
          {loading ? <ClipLoader color={"#276a39"} /> : `Dodaj post`}
        </div>
        <div className={styles.postError}>{postError}</div>
      </div>
    </div>
  );
};
export default DesktopNewPost;
