import React, { useEffect } from 'react';
import styles from './Login.module.css';

// auth through backend
const Login = () => {
	useEffect(() => {
		const timeoutID = setTimeout(() => {
			window.open(process.env.REACT_APP_API_BASE_URL + "/api/auth/login", "_self")
		}, 1000);

		return () => clearTimeout(timeoutID);
	}, []);
	return (
		<div className={styles.login_wrapper}>Redirecting to Spotify...</div>
	)
}

export default Login;