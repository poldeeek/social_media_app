import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { api, authenticationHeader } from "../../../config/apiHost";
import { IRoot } from "../../../store/reducers/rootReducer";
import Bell from "./bell";
import styles from "./bells.module.scss";

interface IWho_IdBell {
  avatar: string;
  _id: string;
  name: string;
  surname: string;
}

export interface IBell {
  _id: string;
  seen: boolean;
  object_id: string;
  type: string;
  user_id: string;
  who_id: IWho_IdBell;
  created_at: string;
  updated_at: string;
}

const Bells: React.FC = () => {
  const [bells, setBells] = useState<IBell[]>([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const currentId = useSelector((state: IRoot) => state.auth.user?._id);
  useEffect(() => {
    setLoading(true);
    api
      .get(
        `http://localhost:5000/api/notifications/getBells/${currentId}?limit=${perPage}&page=${page}`,
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        setBells(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.bellsContainer}>
      {loading ? (
        <div className={styles.loaderConatiner}>
          <ClipLoader color={"#276a39"} />
        </div>
      ) : (
        bells &&
        (bells.length === 0 ? (
          <div className={styles.noNotificationsInfo}>
            Nie masz nowych powiadomień.
          </div>
        ) : (
          bells.map(
            (bell) =>
              currentId && (
                <Bell
                  currentUserId={currentId}
                  notification={bell}
                  key={bell._id}
                />
              )
          )
        ))
      )}
    </div>
  );
};

export default Bells;
