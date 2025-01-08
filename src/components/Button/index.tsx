import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClickMethod?: () => void;
};

const Button = ({ children, onClickMethod = () => {} }: ButtonProps) => {
  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    onClickMethod();
  };
  return (
    <button type="button" className={styles.btn_wrapper} onClick={clickHandler}>
      {children}
    </button>
  );
};

export default Button;
