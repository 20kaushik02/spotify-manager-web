import React from 'react'
import styles from "./Navbar.module.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className={styles.navbar_wrapper}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/graph">Graph</NavLink>
      <NavLink to="/graph2">Graph2</NavLink>
    </nav>
  )
}

export default Navbar