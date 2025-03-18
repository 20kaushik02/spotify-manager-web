import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { authLoginFullURL } from "../../api/paths.ts";

// auth through backend
const Login = (): React.ReactNode => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      window.open(authLoginFullURL, "_self");
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, []);
  return (
    <div className={styles.login_wrapper}>
      <h1>Logging in to Spotify...</h1>
    </div>
  );
};

export default Login;
