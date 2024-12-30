import React from 'react'
import { NavLink } from 'react-router-dom';

import styles from "./StyledNavLink.module.css";

/**
 * @param {{
 * path: string,
 * text: string,
 * activeClass: string,
 * inactiveClass: string
 * }}
 * @returns
 */
const StyledNavLink = ({
  path = "/",
  text = "Go To",
  activeClass = styles.active_link,
  inactiveClass = styles.inactive_link
}) => {

  return (
    <NavLink
      to={path}
      className={({ isActive }) => isActive ? activeClass : inactiveClass}
    >
      {text}
    </NavLink>
  )
}

export default StyledNavLink;
