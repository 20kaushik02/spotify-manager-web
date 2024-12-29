import React, { useContext } from 'react'

import styles from "./Navbar.module.css";

import { AuthContext } from "../../App";
import StyledNavLink from '../StyledNavLink';

const Navbar = () => {
  const auth = useContext(AuthContext);

  return (
    <nav className={styles.navbar_wrapper}>
      <StyledNavLink path="/" text="Home" />
      {
        auth === true ?
          <StyledNavLink path="/logout" text="Logout" /> :
          <StyledNavLink path="/login" text="Login" />
      }
      <StyledNavLink path="/graph" text="Graph" />
      <StyledNavLink path="/about" text="About" />
    </nav>
  )
}

export default Navbar
