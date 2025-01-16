import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { authLoginFullURL } from "../../api/paths";

// auth through backend
const Login = () => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      window.open(authLoginFullURL, "_self");
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, []);
  return <div className={styles.login_wrapper}>Redirecting to Spotify...</div>;
};

export default Login;
