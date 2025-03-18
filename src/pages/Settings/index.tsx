import React, { useContext, useState } from "react";
import styles from "./Settings.module.css";
import Button from "../../components/Button/index.tsx";
import { loadExportDataFullURL } from "../../api/paths.ts";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToastNotification,
  showWarnToastNotification,
} from "../../components/ToastNotification/index.tsx";
import APIWrapper from "../../components/APIWrapper/index.tsx";
import { apiImportGraph } from "../../api/load.ts";
import { RefreshAuthContext } from "../../App.tsx";
import SimpleLoader from "../../components/SimpleLoader/index.tsx";

const Settings = (): React.ReactNode => {
  const refreshAuth = useContext(RefreshAuthContext);
  const navigate = useNavigate();
  const [dataFile, setDataFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);

  // let backend handle the attachment
  const exportGraph = () => {
    window.open(loadExportDataFullURL);
    return;
  };

  const dataFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/json") {
      showWarnToastNotification("Must be JSON file!");
      return;
    }
    setDataFile(selectedFile);
  };

  const importGraph = async () => {
    if (!dataFile) {
      showWarnToastNotification("Select a file!");
      return;
    }
    setLoading(true);
    const resp = await APIWrapper({
      apiFn: apiImportGraph,
      data: dataFile,
      refreshAuth,
    });
    setLoading(false);
    if (resp?.status === 200) {
      showSuccessToastNotification(resp.data.message);
    }
    return;
  };

  return (
    <div className={styles.settings_wrapper}>
      {loading && <SimpleLoader />}
      <h1>Settings</h1>
      <hr className="divider" />
      <div className={styles.settings_controls}>
        <Button disabled={loading} onClickMethod={exportGraph}>
          Export Data
        </Button>
        <input
          type="file"
          name="dataFile"
          onChange={dataFileChangeHandler}
          className={styles.settings_dataFile}
        />
        <p className={styles.settings_dataFile_selection}>
          {dataFile ? `Selected file: ${dataFile.name}` : "No file selected"}
        </p>
        <Button disabled={loading} onClickMethod={importGraph}>
          Import Data
        </Button>
        <Button disabled={loading} onClickMethod={() => navigate("/logout")}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
