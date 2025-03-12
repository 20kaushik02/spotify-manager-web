import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Landing.module.css";
import {
  showInfoToastNotification,
  showSuccessToastNotification,
} from "../../components/ToastNotification/index.tsx";
import AnimatedSVG from "../../components/AnimatedSVG/index.tsx";

const Landing = (): React.ReactNode => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "success") {
      showSuccessToastNotification("Logged in!");
    } else if (searchParams.get("logout") === "success") {
      showInfoToastNotification("Logged out.");
    }
  }, [searchParams]);
  return (
    <>
      <header className={styles.app_header}>
        <AnimatedSVG />
        <h1>organize your Spotify playlists as a graph</h1>
      </header>
      <ul>
        <li>DAG graph of your playlists</li>
        <li>Link them to sync tracks</li>
        <li>Periodic syncing</li>
      </ul>
    </>
  );
};

export default Landing;
