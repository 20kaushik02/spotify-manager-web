import React, { useEffect } from "react";
import styles from "./Logout.module.css";
import { authLogoutFullURL } from "../../api/paths.ts";

const Logout = (): React.ReactNode => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      window.open(authLogoutFullURL, "_self");
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, []);
  return (
    <div className={styles.logout_wrapper}>
      <h1>See you soon!</h1>
    </div>
  );
};

export default Logout;
