import firebase, { storage } from "../../../config/firebase";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./editProfile.module.scss";
import { v4 as uuidv4 } from "uuid";
import { api, authenticationHeader } from "../../../config/apiHost";
import { updateProfilePhoto } from "../../../store/actions/authActions";
import ClipLoader from "react-spinners/ClipLoader";

const ChangePhoto: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: IRoot) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);

  const [show, setShow] = useState(false);

  const [choosenPhotoUrl, setChoosenPhotoUrl] = useState<string | null>(null);
  const [choosenPhoto, setChoosenPhoto] = useState<File | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setError(null);
        setChoosenPhoto(file);
        setChoosenPhotoUrl(URL.createObjectURL(file));
      } else {
        setError("Zły format pliku!");
        setChoosenPhoto(null);
        setChoosenPhotoUrl(null);
      }
    }
  };

  const handleUpload = () => {
    if (loading) return;

    setLoading(true);
    if (choosenPhoto) {
      const fileName = `${uuidv4()}`;
      const uploadTask = storage.ref(`avatars/${fileName}`).put(choosenPhoto);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        (err) => {
          setLoading(false);
          setError("Błąd połączenia z bazą danych.");
          setMessage(null);
        },
        () => {
          storage
            .ref("avatars")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              setError(null);
              setMessage(null);
              updatePhoto(url);
            });
        }
      );
    } else {
      setLoading(false);
      setError("Brak zdjęcia.");
      setMessage(null);
    }
  };

  const updatePhoto = (uploadedPhotoUrl: string) => {
    user &&
      api
        .post(
          `http://localhost:5000/api/users/update/photo/${user._id}`,
          {
            photo: uploadedPhotoUrl,
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          dispatch(updateProfilePhoto(uploadedPhotoUrl));
          setLoading(false);
          setMessage("Zdjęcie zakutalizowano.");
          setError(null);
        })
        .catch((err) => {
          setLoading(false);
          setError("Błąd połączenia z serwerem.");
          setMessage(null);
        });
  };

  return (
    <div className={styles.photoChange}>
      <p onClick={() => setShow(!show)}>
        Zmiana zdjęcia{" "}
        {show ? (
          <i className="fas fa-angle-up"></i>
        ) : (
          <i className="fas fa-angle-down"></i>
        )}
      </p>
      {show && (
        <>
          <div className={styles.photos}>
            <img src={user?.avatar} alt="avatar" />
            {choosenPhotoUrl && (
              <img
                src={choosenPhotoUrl}
                className={styles.choosenPhoto}
                alt="choosen"
              />
            )}
          </div>
          <div className={styles.buttons}>
            <div className={styles.button}>
              <label htmlFor="profile-photo-upload">Wybierz zdjęcie</label>
              <input
                id="profile-photo-upload"
                type="file"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => handlePhotoChange(e)}
              />
            </div>
            <div className={styles.button} onClick={() => handleUpload()}>
              Zaktualizuj zdjęcie
            </div>
          </div>
          <div>
            {loading && (
              <div className={styles.message}>
                <ClipLoader color={"#276a39"} />
              </div>
            )}
            {message && <div className={styles.message}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChangePhoto;
