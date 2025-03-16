import React from "react";
import styles from "./Settings.module.css";
import Button from "../../components/Button/index.tsx";

const Settings = (): React.ReactNode => {
  return (
    <div className={styles.settings_wrapper}>
      <h1>Settings</h1>
      <div className={styles.settings_controls}>
        <Button>Export Data</Button>
        <Button>Import Data</Button>
      </div>
    </div>
  );
};

export default Settings;
