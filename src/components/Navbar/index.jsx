import React, { useContext } from 'react'

import styles from "./Navbar.module.css";

import { AuthContext } from "../../App";
import StyledNavLink from '../StyledNavLink';

const Navbar = () => {
  const auth = useContext(AuthContext);

  return (
    <nav className={styles.navbar_wrapper}>
      <StyledNavLink path="/" text="Home" />
      <StyledNavLink path="/graph" text="Graph" />
      <StyledNavLink path="/about" text="About" />
      {
        auth === true ?
          <StyledNavLink path="/logout" text="Logout" /> :
          <StyledNavLink path="/login" text="Login" />
      }
    </nav>
  )
}

export default Navbar
