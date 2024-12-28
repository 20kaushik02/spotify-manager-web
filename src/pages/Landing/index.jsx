import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import styles from "./Landing.module.css"
import logo from '../../assets/icons/logo.svg';
import { showSuccessToastNotification } from "../../components/ToastNotification";


const Landing = () => {
	// eslint-disable-next-line no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		if (searchParams.get("login") === "success") {
			showSuccessToastNotification("Logged in!");
		}
	}, [searchParams]);
	return (
		<header className={styles.app_header}>
			<img src={logo} className={styles.app_logo} alt="logo" />
			<h1>Organize your Spotify playlists as a graph.</h1>
			<h5>Features:</h5>
			<ul>
				<li>blah 1</li>
			</ul>
		</header>
	)
}

export default Landing