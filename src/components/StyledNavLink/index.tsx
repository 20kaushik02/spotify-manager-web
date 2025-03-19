import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./StyledNavLink.module.css";

type StyledNavLinkProps = {
  path: string;
  text: string;
  activeClass?: string;
  inactiveClass?: string;
};
const StyledNavLink = ({
  path = "/",
  text = "Go To",
  activeClass = styles.active_link,
  inactiveClass = styles.inactive_link,
}: StyledNavLinkProps): React.ReactNode => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `${styles.base_link} ${isActive ? activeClass : inactiveClass}`
      }
    >
      {text}
    </NavLink>
  );
};

export default StyledNavLink;
