import React, { useEffect } from "react";
import styles from "./PageNotFound.module.css";
import { showWarnToastNotification } from "../../components/ToastNotification/index.tsx";

const PageNotFound = ():React.ReactNode => {
  useEffect(() => {
    showWarnToastNotification("Oops!");
  }, []);

  return <div className={styles.pnf_wrapper}>Page Not Found</div>;
};

export default PageNotFound;
