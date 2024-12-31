import React from 'react';
import styles from "./Button.module.css";

function Button({ children, onClickMethod }) {
  const clickHandler = (e) => {
    e.preventDefault();
    onClickMethod();
  }
  return (
    <button type="button"
      className={styles.btn_wrapper}
      onClick={clickHandler}>
      {children}
    </button>
  )
}

export default Button;
