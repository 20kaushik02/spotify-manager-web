import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import styles from "./Landing.module.css"
import logo from '../../assets/icons/logo.svg';
import { showInfoToastNotification, showSuccessToastNotification } from "../../components/ToastNotification";
import AnimatedSVG from "../../components/AnimatedSVG";


const Landing = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
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
  )
}

export default Landing
