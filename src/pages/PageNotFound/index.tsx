import React, { useEffect } from "react";
import styles from "./PageNotFound.module.css";
import { showWarnToastNotification } from "../../components/ToastNotification/index.tsx";
import AnimatedSVG from "../../components/AnimatedSVG/index.tsx";

const PageNotFound = (): React.ReactNode => {
  useEffect(() => {
    showWarnToastNotification("Oops!");
  }, []);

  return (
    <div className={styles.pnf_wrapper}>
      <AnimatedSVG/>
      <h1>Page Not Found</h1>
    </div>
  );
};

export default PageNotFound;
