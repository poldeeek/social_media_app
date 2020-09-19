import React from "react";
import { useMediaQuery } from "react-responsive";

import styles from "./publicPage.module.scss";
import logo from "../../images/logo.svg";

import LoginForm from "./loginForm/loginForm";
import RegisterMobileForm from "./registerMobileForm/registerMobileForm";
import RegisterDesktopForm from "./registerDesktopForm/registerDesktopForm";

const PublicPage: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1024px)",
  });

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  return (
    <div className={styles.publicPage}>
      <section className={styles.section1}>
        <div className={styles.bg}></div>
        <div className={styles.navbar}>
          <div
            className={styles.navbarElement}
            style={{ borderBottom: "2px solid #e2e0e1", marginTop: "2px" }}
          >
            Logowanie
          </div>
          <a href="#about">
            <div className={styles.navbarElement}>O nas</div>
          </a>
          <a href="#contact">
            <div className={styles.navbarElement}>Kontakt</div>
          </a>
        </div>
        <div className={styles.logo}>
          <img alt="logo" src={logo} className={styles.logoPicture} />
          <span className={styles.appName}>GreenSociety</span>
        </div>
        <LoginForm />
        {isDesktopOrLaptop && <RegisterDesktopForm />}
        {isTabletOrMobile && <RegisterMobileForm />}
      </section>
      <section className={styles.section2} id="about">
        <div className={styles.bg}></div>
        <div className={styles.aboutTitle}>O nas</div>
        <div className={styles.aboutContent}>
          Studencki projekt
          <br /> GreenSociety
          <br /> jest aplikacją typu
          <br /> social-media zbudowaną
          <br /> przez Pawła Polak
          <br /> na potrzeby zaliczenia pracy inżynierskiej.
        </div>
      </section>
      <section className={styles.section3} id="contact">
        <div className={styles.bg}></div>
        <div className={styles.contactTitle}>Kontakt</div>
        <div className={styles.contactContent}>
          <p>Paweł Polak</p>
          <p>pawelp258@gmail.com</p>
          <p>+48 723-301-467</p>
        </div>
        <div className={styles.footer}>Paweł Polak © 2020</div>
      </section>
    </div>
  );
};

export default PublicPage;
