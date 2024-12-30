import React, { useEffect } from 'react';
import styles from "./PageNotFound.module.css";
import { showWarnToastNotification } from '../../components/ToastNotification';

const PageNotFound = () => {
  useEffect(() => {
    showWarnToastNotification("Oops!")
  }, []);

  return (
    <div className={styles.pnf_wrapper}>
      PageNotFound
    </div>
  )
}

export default PageNotFound
