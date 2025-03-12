import React, { useContext } from "react";

import styles from "./Navbar.module.css";

import { AuthContext } from "../../App.tsx";
import StyledNavLink from "../StyledNavLink/index.tsx";

const Navbar = (): React.ReactNode => {
  const auth = useContext(AuthContext);

  return (
    <nav className={`${styles.navbar_wrapper} custom_scrollbar`}>
      <StyledNavLink path="/" text="About" />
      <StyledNavLink path="/graph" text="Graph" />
      <StyledNavLink path="/how-to" text="How To" />
      {auth === true ? (
        <StyledNavLink path="/logout" text="Logout" />
      ) : (
        <StyledNavLink path="/login" text="Login" />
      )}
    </nav>
  );
};

export default Navbar;
