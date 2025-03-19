import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./Landing.module.css";
import {
  showInfoToastNotification,
  showSuccessToastNotification,
} from "../../components/ToastNotification/index.tsx";
// import AnimatedSVG from "../../components/AnimatedSVG/index.tsx";
import { FaGithub } from "react-icons/fa";

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
    <div className={styles.landing_wrapper}>
      <header className={styles.landing_header}>
        {/* <AnimatedSVG size={192} /> */}
        <div className={styles.landing_content_wrapper}>
          <video height={320} width={320} autoPlay loop muted playsInline>
            <source
              src={`${process.env["PUBLIC_URL"]}/landing-gifc.mp4`}
              type="video/mp4"
            />
          </video>
          <video height={320} width={480} autoPlay loop muted playsInline>
            <source
              src={`${process.env["PUBLIC_URL"]}/landing-gif-2c.mp4`}
              type="video/mp4"
            />
          </video>
        </div>
        <h2>organize your Spotify playlists as a graph</h2>
      </header>
      <div className={styles.landing_content_wrapper}>
        <ul className={styles.landing_content}>
          <li>📊 Visualize your playlists as a connected graph</li>
          <li>🔗 Link playlists together to keep them in sync</li>
          <li>🔄 Fill songs from linked playlists</li>
          <li>✂️ Prune songs that don't belong</li>
          <li>🔜 More features on the way!</li>
        </ul>
      </div>
      <div className={styles.landing_links}>
        Check it out - &nbsp;
        <Link to="https://github.com/20kaushik02/spotify-manager-web">
          <FaGithub size={36} />
        </Link>
      </div>
    </div>
  );
};

export default Landing;
