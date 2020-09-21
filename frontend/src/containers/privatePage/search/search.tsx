import React, { useState, useEffect } from "react";
import { api, authenticationHeader } from "../../../config/apiHost";
import useDebounce from "../../../hooks/useDebounce";
import styles from "./search.module.scss";
import SearchingUser, { ISearchingUser } from "./searchingUser/searchingUser";
import ClipLoader from "react-spinners/ClipLoader";

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [isSearching, setIsSearching] = useState(false);

  const [results, setResults] = useState([]);

  // pagination
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [showMoreResults, setShowMoreResults] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(0);
      setIsSearching(true);
      searchUsers(debouncedSearchTerm, 0).then((results) => {
        setIsSearching(false);
        if (results.length === perPage) setShowMoreResults(true);
        else setShowMoreResults(false);
        setResults(results);
      });
    } else {
      setShowMoreResults(false);

      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const searchUsers = (search: string, pageNr: number) => {
    return api
      .get(
        `http://localhost:5000/api/users/search?q=${search}&p=${pageNr}&limit=${perPage}`,
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  const moreResults = () => {
    searchUsers(searchTerm, page + 1).then((moreResults) => {
      if (moreResults.length === perPage) setShowMoreResults(true);
      else setShowMoreResults(false);
      setPage(page + 1);

      const newResults = results.concat(moreResults);

      setResults(newResults);
    });
  };

  return (
    <div className={styles.searchContainer}>
      <i className={`fas fa-search ${styles.searchIcon}`}></i>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Szukaj..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isSearching ? (
        <div className={styles.spinner}>
          <ClipLoader color={"#276a39"} />
        </div>
      ) : (
        <div className={styles.usersList}>
          {results.map((user: ISearchingUser) => {
            return <SearchingUser key={user._id} user={user} />;
          })}
          {showMoreResults && (
            <div
              className={styles.showMoreButton}
              onClick={() => moreResults()}
            >
              Pokaż więcej wyników <i className="fas fa-caret-down"></i>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
