import React from "react";
import styles from "./background.module.scss";

const Background: React.FC = () => {
  return (
    <>
      <div className={styles.backgroundColor}></div>
      <div className={styles.backgroundPolygon}></div>
    </>
  );
};

export default Background;
