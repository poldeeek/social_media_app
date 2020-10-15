import React, { useCallback, useEffect, useRef, useState } from "react";
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
  let mounted = true;
  const [bells, setBells] = useState<IBell[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [perPage, setPerPage] = useState(10);

  const [fetchError, setFetchError] = useState("");

  const [lastBellDate, setLastBellDate] = useState<string | null>(null);

  // is any more posts in database
  const [hasMore, setHasMore] = useState(true);

  // ref to loading div
  const bellLoader = useRef<HTMLDivElement>(null);

  const currentId = useSelector((state: IRoot) => state.auth.user?._id);

  const fetchBells = () => {
    setIsLoading(true);
    let url;
    if (lastBellDate)
      url = `http://localhost:5000/api/notifications/getBells/${currentId}?limit=${perPage}&date=${lastBellDate}`;
    else
      url = `http://localhost:5000/api/notifications/getBells/${currentId}?limit=${perPage}`;

    hasMore &&
      api
        .get(url, {
          headers: authenticationHeader(),
        })
        .then((resp) => {
          if (mounted) {
            if (resp.data.length === 0) {
              setIsLoading(false);
              setFetchError("");
              setHasMore(false);
              return;
            }
            setBells((prevState) => [...prevState, ...resp.data]);
            if (resp.data.length < perPage) setHasMore(false);
            setLastBellDate(resp.data[resp.data.length - 1].updated_at);
            setFetchError("");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (mounted) {
            setFetchError("Problem z pobraniem powiadomień.");
            setIsLoading(false);
          }
        });
  };

  // get first notifications
  useEffect(() => {
    fetchBells();

    return () => {
      mounted = false;
      console.log(mounted);
      return;
    };
  }, []);

  //infinity scroll - intersection observer callback function
  const loadMore = useCallback(
    (entries) => {
      const target = entries.find(
        (element: IntersectionObserverEntry) =>
          element.target.id === "bellLoader"
      );

      if (target.isIntersecting && hasMore && lastBellDate && !isLoading) {
        fetchBells();
      }
    },
    [hasMore, lastBellDate, fetchBells, isLoading]
  );

  //infinity scroll - intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (bellLoader && bellLoader.current) observer.observe(bellLoader.current);

    return () => {
      if (bellLoader.current) observer.unobserve(bellLoader.current);
    };
  }, [bellLoader, loadMore]);

  return (
    <div className={styles.bellsContainer}>
      {!isLoading &&
        bells &&
        (bells.length === 0 ? (
          <div className={styles.noNotificationsInfo}>
            Nie masz nowych powiadomień.
          </div>
        ) : (
          bells &&
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
        ))}

      <div id="bellLoader" ref={bellLoader} className={styles.loaderConatiner}>
        {hasMore && <ClipLoader color={"#276a39"} />}
      </div>
      {fetchError && <div style={{ color: "#D22E2E" }}>{fetchError}</div>}
    </div>
  );
};

export default Bells;
