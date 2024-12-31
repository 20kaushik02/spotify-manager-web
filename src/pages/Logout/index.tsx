import React, { useEffect } from "react";
import styles from "./Logout.module.css";
import { authLogoutURL } from "../../api/paths";

const Logout = () => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      window.open(authLogoutURL, "_self");
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, []);
  return <div className={styles.logout_wrapper}>See you soon!</div>;
};

export default Logout;
