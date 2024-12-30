import React, { useContext } from 'react'

import styles from "./Navbar.module.css";

import { AuthContext } from "../../App";
import StyledNavLink from '../StyledNavLink';

const Navbar = () => {
  const auth = useContext(AuthContext);

  return (
    <nav className={styles.navbar_wrapper}>
      <StyledNavLink exact path="/" text="About" />
      <StyledNavLink exact path="/graph" text="Graph" />
      {
        auth === true ?
          <StyledNavLink exact path="/logout" text="Logout" /> :
          <StyledNavLink exact path="/login" text="Login" />
      }
    </nav>
  )
}

export default Navbar
