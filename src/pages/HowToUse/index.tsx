import React from "react";
import { Link } from "react-router-dom";
import styles from "./HowToUse.module.css";
const HowToUse = (): React.ReactNode => {
  return (
    <div className={styles.htu_wrapper}>
      <h1>How To Use?</h1>
      <div className={styles.htu_content_wrapper}>
        <ul>
          <li>
            <h6>Step 1: Sync your playlists</h6>
            <ul>
              <li>
                In the{" "}
                <Link to="/graph">
                  <u>graph</u>
                </Link>{" "}
                manager, click 'Sync Spotify' to load your playlists into the
                app. This pulls your latest Spotify playlists into the
                application.
              </li>
              <li>
                💡 Reminder: If you create or delete playlists later, you’ll
                need to sync again to update your data (Might add auto-sync
                later)
              </li>
            </ul>
          </li>
          <li>
            <h6>Step 2: Build Your Graph</h6>
            <ul>
              <li>
                Click and drag from one playlist’s bottom handle to another’s
                top handle to create a link
                <video height={320} width={320} autoPlay loop muted playsInline>
                  <source
                    src={`${process.env["PUBLIC_URL"]}/landing-gifc.mp4`}
                    type="video/mp4"
                  />
                </video>
              </li>
              <li>
                Click on a link and hit the Delete key or the 'Delete Link'
                button to remove it.
              </li>
            </ul>
          </li>
          <li>
            <h6>Step 3: Let The Music Flow!</h6>
            <ul>
              Once links exist, you can:
              <li>
                ✅ Backfill a Link – Add missing tracks from one playlist to
                another.
              </li>
              <li>
                ✅ Backfill a Chain – Backfill iteratively across multiple
                connected playlists.
              </li>
              <video height={320} width={480} autoPlay loop muted playsInline>
                <source
                  src={`${process.env["PUBLIC_URL"]}/landing-gif-2c.mp4`}
                  type="video/mp4"
                />
              </video>
              <li>
                ✅ Prune a Link – Remove excess tracks from the source playlist.
              </li>
              <li>
                ✅ Prune a Chain – Do the same, but across a whole sequence of
                links.
              </li>
            </ul>
          </li>
          <li>
            <h6>What is this for?</h6>
            <ul>
              <li>
                I like to organize my own playlists as subsets/supersets. For
                example: I have an 'all' playlist, that has every song I listen
                to. Then I have a playlist for each genre. I have a playlist for
                soundtracks of certain shows or games. Some I make for my
                friends, and so on.
              </li>
              <li>
                Then there are playlists made by others, strangers and friends
                alike, that I save to my library, regularly checking for new
                additions.
              </li>
              <li>
                This application is to:
                <ol>
                  <li>
                    make sense of the growing chaos that is a music aficionado's
                    Spotify library - the graph helps visualize connections, and
                    makes music collection/maintenance easier
                  </li>
                  <li>
                    automate the process - the REST API backend can be cURLed to
                    achieve this
                  </li>
                </ol>
              </li>
            </ul>
          </li>
          <li>
            <h6>For more:</h6>
            <ul>
              Check it out on GitHub:
              <li>
                <Link to="https://github.com/20kaushik02/spotify-manager-web">
                  <u>The front-end - ReactJS (ReactFlow)</u>
                </Link>
              </li>
              <li>
                <Link to="https://github.com/20kaushik02/spotify-manager">
                  <u>The REST API - ExpressJS</u>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HowToUse;
