import React from "react";
import styles from "./backdrop.module.scss";

interface IBackdropProps {
  show: boolean;
  close: () => void;
}

const Backdrop: React.FC<IBackdropProps> = ({ show, close }) => {
  return show ? (
    <div className={styles.Backdrop} onClick={() => close()}></div>
  ) : null;
};

export default Backdrop;
